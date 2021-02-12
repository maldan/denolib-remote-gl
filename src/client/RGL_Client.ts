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

        // Request sync
        setInterval(() => {
            this.send({
                type: "sync",
            });
        }, 1000 / 60);

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
        document.addEventListener("mousemove", (e: MouseEvent) => {
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
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            this.send({
                type: "keydown",
                key: e.key,
                code: e.keyCode,
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
        });
    }

    initSocket() {
        this._ws = new WebSocket(this._url);
        this._ws.onopen = () => {
            this._isConnected = true;
            console.log("Connected");
            this.send({
                type: "init",
                width: window.innerWidth,
                height: window.innerHeight,
            });
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
            // JSON data
            if (typeof msg.data === "string") {
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
                            /*if (GL_Client.frameRate >= 60) {*/
                            obj.updateVertex(vertex, true);
                            /*} else {
                                obj.updateVertex(vertex);
                            }*/
                        }
                    }
                }
            }
        };
    }

    send(data: unknown) {
        if (!this._isConnected) {
            return;
        }
        this._ws.send(JSON.stringify(data));
    }
}
