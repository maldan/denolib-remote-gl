/// <reference lib="dom" />

declare var document: HTMLDocument;

// deno-lint-ignore camelcase
import { RGL_Render } from "../client/RGL_Render.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_ClientObject } from "./RGL_ClientObject.ts";
// deno-lint-ignore camelcase
import { RGL_Material } from "./RGL_Material.ts";

import { ByteSet } from "../../client.deps.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "../server/package/Package_Base.ts";
// deno-lint-ignore camelcase
import { Package_Init } from "../server/package/Package_Init.ts";

import {
    // deno-lint-ignore camelcase
    Package_ResizeScreen,
    // deno-lint-ignore camelcase
    Package_SyncDelete,
    // deno-lint-ignore camelcase
    Package_UserEventKeyDown,
    // deno-lint-ignore camelcase
    Package_UserEventKeyUp,
    // deno-lint-ignore camelcase
    RGL_PackageType,
    // deno-lint-ignore camelcase
    RGL_ParsePackage,
} from "../server/RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_SyncShaderList } from "../server/package/Package_SyncShaderList.ts";
// deno-lint-ignore camelcase
import { Package_SyncObjectList } from "../server/package/Package_SyncObjectList.ts";
// deno-lint-ignore camelcase
import { Package_SyncChangeVertex } from "../server/package/Package_SyncChangeVertex.ts";
// deno-lint-ignore camelcase
import { RGL_Texture } from "./RGL_Texture.ts";
// deno-lint-ignore camelcase
import { Package_SyncAdd } from "../server/package/Package_SyncAdd.ts";

// deno-lint-ignore camelcase
export class RGL_Client {
    private _gl!: WebGLRenderingContext;
    private _render!: RGL_Render;
    private _ws!: WebSocket;
    private _url = "";
    private _isConnected = false;
    private _rate = 0;

    // static frameRate = 60;

    init(element: string, url: string) {
        // Get canvas
        const canvas = document.querySelector(element) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error("Element not found!");
        }

        // Set full size
        canvas.setAttribute("width", window.innerWidth + "");
        canvas.setAttribute("height", window.innerHeight + "");

        // Initialize the GL context
        const gl = canvas.getContext("webgl", { antialias: false });

        // Only continue if WebGL is available and working
        if (gl === null) {
            throw new Error(
                "Unable to initialize WebGL. Your browser or machine may not support it."
            );
        }

        // Init render
        this._gl = gl;
        this._url = url;
        this._render = new RGL_Render(gl);

        this.initSocket();
        this.initEvents();

        // Draw scene
        setInterval(() => {
            this._render.draw();
        }, 1000 / 60);

        setInterval(() => {
            console.log((this._rate / 1024).toFixed(2) + " kb/s");
            this._rate = 0;
        }, 1000);
    }

    initEvents() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            this.sendPackage(new Package_UserEventKeyDown(e.key, e.keyCode));
        });
        document.addEventListener("keyup", (e: KeyboardEvent) => {
            this.sendPackage(new Package_UserEventKeyUp(e.key, e.keyCode));
        });
        /*document.addEventListener("mousemove", (e: MouseEvent) => {
            this.send({
                type: "mousemove",
                x: e.pageX,
                y: e.pageY,
            });
        });
        document.addEventListener("touchmove", (e: TouchEvent) => {
            this.send({
                type: "mousemove",
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY,
            });
        });
        document.addEventListener("click", (e: MouseEvent) => {
            this.send({
                type: "click",
                x: e.pageX,
                y: e.pageY,
            });
        });
        document.addEventListener("mousedown", (e: MouseEvent) => {
            this.send({
                type: "mousedown",
                x: e.pageX,
                y: e.pageY,
            });
        });
        document.addEventListener("mouseup", (e: MouseEvent) => {
            this.send({
                type: "mouseup",
                x: e.pageX,
                y: e.pageY,
            });
        });
        
        document.addEventListener("keyup", (e: KeyboardEvent) => {
            this.send({
                type: "keyup",
                key: e.key,
                code: e.keyCode,
            });
        });
        document.addEventListener("wheel", (e: WheelEvent) => {
            this.send({
                type: "zoom",
                zoom: e.deltaY > 0 ? 0.025 : -0.025,
            });
        });*/
    }

    initSocket() {
        const gl = this._gl;

        this._ws = new WebSocket(this._url);
        this._ws.onopen = () => {
            this._isConnected = true;
            console.log("Connected");
            this.sendPackage(new Package_Init());
            this.sendPackage(new Package_ResizeScreen(window.innerWidth, window.innerHeight));
        };
        this._ws.onclose = () => {
            this._isConnected = false;
            console.log("Closed");

            // Reconnect
            setTimeout(() => {
                this.initSocket();
            }, 1500);
        };
        this._ws.onmessage = async (msg) => {
            // Handle package
            if (msg.data instanceof Blob) {
                this._rate += msg.data.size;

                // Parse package
                const p = RGL_ParsePackage(new Uint8Array(await msg.data.arrayBuffer()));

                // Init shader list
                if (p instanceof Package_SyncShaderList) {
                    p.shaderList.forEach((x) => {
                        this._render.material[x.id] = new RGL_Material(this._gl, x);
                    });
                }

                // Init object list
                if (p instanceof Package_SyncObjectList) {
                    this._render.objectList.length = 0;
                    p.objectList.forEach((x) => {
                        const exists = this._render.objectList.find((y) => y.id === x.id);
                        if (!exists) {
                            const obj = new RGL_ClientObject(this._gl, x);

                            // Add texture
                            if (!this._render.texture[obj.textureUrl]) {
                                this._render.texture[obj.textureUrl] = new RGL_Texture(
                                    gl,
                                    obj.textureUrl
                                );
                                this._render.texture[obj.textureUrl].load();
                            }

                            this._render.objectList.push(obj);
                        }
                    });
                }

                // Add new objects
                if (p instanceof Package_SyncAdd) {
                    p.objectList.forEach((x) => {
                        const exists = this._render.objectList.find((y) => y.id === x.id);
                        if (!exists) {
                            const obj = new RGL_ClientObject(this._gl, x);

                            // Add texture
                            if (!this._render.texture[obj.textureUrl]) {
                                this._render.texture[obj.textureUrl] = new RGL_Texture(
                                    gl,
                                    obj.textureUrl
                                );
                                this._render.texture[obj.textureUrl].load();
                            }

                            this._render.objectList.push(obj);
                        }
                    });
                }

                // Add new objects
                if (p instanceof Package_SyncDelete) {
                    p.objectList.forEach((x) => {
                        const index = this._render.objectList.findIndex((y) => y.id === x);
                        if (index !== -1) {
                            this._render.objectList.splice(index, 1);
                        }
                    });
                }

                // Vertex change
                if (p instanceof Package_SyncChangeVertex) {
                    p.changeList.forEach((x) => {
                        const obj = this._render.objectList.find((y) => y.id === x.id);
                        if (obj) {
                            obj.updateVertex(x.vertex, true);
                        }
                    });
                } else {
                    console.log(p);
                }
            }

            // JSON data
            /*if (typeof msg.data === "string") {
                this._rate += msg.data.length;

                const p = JSON.parse(msg.data);
                if (p.type === "shaders") {
                    for (let i = 0; i < p.data.length; i++) {
                        const shader = new RGL_Shader(p.data[i]);
                        const material = new RGL_Material(this._gl, shader);
                        this._render.material[shader.id] = material;
                    }
                }
                if (p.type === "objects") {
                    for (let i = 0; i < p.data.length; i++) {
                        const exists = this._render.objectList.find((x) => x.id === p.data[i].id);
                        if (!exists) {
                            const obj = new RGL_ClientObject(this._gl, p.data[i]);
                            this._render.objectList.push(obj);
                        }
                    }
                }
            }

            // Binary data
            if (msg.data instanceof Blob) {
                this._rate += msg.data.size;

                const bytes = ByteSet.from(await msg.data.arrayBuffer());
                const packageType = bytes.read.uint8();
                if (packageType === 1) {
                    const len = bytes.read.uint16();
                    for (let i = 0; i < len; i++) {
                        const objectId = bytes.read.uint16();
                        const vertexAmount = bytes.read.uint16();
                        const vertex = bytes.read.floatArray(vertexAmount);

                        const obj = this._render.objectList.find((x) => x.id === objectId);
                        if (obj) {
                           
                            obj.updateVertex(vertex, true);
                            
                        }
                    }
                }
            }*/
        };
    }

    sendPackage(pack: Package_Base) {
        if (!this._isConnected) {
            return;
        }
        this._ws.send(pack.pack());
    }
}
