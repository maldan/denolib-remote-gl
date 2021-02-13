import { WebSocket, Http } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { RGL_EventEmitter } from "../engine/RGL_EventEmitter.ts";
// deno-lint-ignore camelcase
import { Package_Init } from "./package/Package_Init.ts";

import {
    // deno-lint-ignore camelcase
    Package_ResizeScreen,
    // deno-lint-ignore camelcase
    Package_UserEventKeyDown,
    // deno-lint-ignore camelcase
    Package_UserEventKeyUp,
    // deno-lint-ignore camelcase
    RGL_ParsePackage,
} from "./RGL_Package.ts";
// deno-lint-ignore camelcase
import { RGL_Session } from "./RGL_Session.ts";

// deno-lint-ignore camelcase
export class RGL_Server {
    readonly session = new RGL_Session();

    readonly event: RGL_EventEmitter<RGL_Session> = new RGL_EventEmitter(this.session);

    async handleWs(sock: WebSocket.WebSocket) {
        // Create session
        this.session.addClient(sock);

        try {
            // Read event from socket
            for await (const ev of sock) {
                // Parse package
                /*if (typeof ev === "string") {
                    const p = JSON.parse(ev);

                    if (p.type === "init") {
                        this.session.resize(p.width, p.height);
                        await this.session.sync();
                    }

                    if (p.type === "sync") {
                        await this.session.syncChanges();
                    }

                    if (p.type === "mousemove") {
                        this.session.input.cursor.x = p.x;
                        this.session.input.cursor.y = p.y;
                        this.session.scene.handleEvent("mousemove");
                    }

                    if (p.type === "mousedown") {
                        this.session.input.cursor.x = p.x;
                        this.session.input.cursor.y = p.y;
                        this.session.input.cursor.isDown = true;
                    }

                    if (p.type === "mouseup") {
                        this.session.input.cursor.x = p.x;
                        this.session.input.cursor.y = p.y;
                        this.session.input.cursor.isDown = false;
                    }

                    if (p.type === "keydown") {
                        this.session.input.keys[p.code] = true;
                    }
                    if (p.type === "keyup") {
                        this.session.input.keys[p.code] = false;
                    }
                    if (p.type === "zoom") {
                        this.session.scene.camera.zoom *= 1 - p.zoom;
                        this.session.scene.objectList.forEach((x) => {
                            x.isChanged = true;
                        });
                    }
                }*/
                if (ev instanceof Uint8Array) {
                    const p = RGL_ParsePackage(ev);

                    // Client connected and request init data
                    if (p instanceof Package_Init) {
                        await this.session.syncShaderList();
                        await this.session.syncObjectList();
                    }

                    // User down key
                    if (p instanceof Package_UserEventKeyDown) {
                        this.session.input.keys[p.keyCode] = true;
                    }
                    // User up key
                    if (p instanceof Package_UserEventKeyUp) {
                        this.session.input.keys[p.keyCode] = false;
                    }
                    // User up key
                    if (p instanceof Package_ResizeScreen) {
                        this.session.scene.camera.width = p.width;
                        this.session.scene.camera.height = p.height;
                    }
                } else if (WebSocket.isWebSocketCloseEvent(ev)) {
                    this.session.removeClient(sock);
                    const { code, reason } = ev;
                    console.log("ws:Close", code, reason);
                }
            }
        } catch (err) {
            console.error(`failed to receive frame: ${err}`);

            if (!sock.isClosed) {
                await sock.close(1000).catch(console.error);
            }
        }
    }

    /**
     * Start server
     * @param {number} port
     */
    async init(port: number) {
        // Update cycle
        let f = 0;
        setInterval(async () => {
            this.event.emit("update");
            if (f++ > 0) {
                f = 0;
                await this.session.syncAdded();
                await this.session.syncDeleted();
                await this.session.syncChangeList();
            }
        }, 1000 / 60);

        for await (const req of Http.serve(`:${port}`)) {
            const { conn, r: bufReader, w: bufWriter, headers } = req;
            const x = await WebSocket.acceptWebSocket({
                conn,
                bufReader,
                bufWriter,
                headers,
            });
            this.handleWs(x);
        }
    }

    async compileClientTo(path: string) {
        const root = import.meta.url
            .replace("src/server/RGL_Server.ts", "")
            .replace("file:///", "");
        console.log(`Client compilation...`);
        const cmd = Deno.run({
            cmd: ["deno", "bundle", "--config", root + "tsconfig.json", root + "client.ts", path],
            stdout: "piped",
            stderr: "piped",
        });
        // await its completion
        const { code } = await cmd.status();

        if (code === 0) {
            const rawOutput = await cmd.output();
            await Deno.stdout.write(rawOutput);
        } else {
            const rawError = await cmd.stderrOutput();
            const errorString = new TextDecoder().decode(rawError);
            console.log(errorString);
        }

        console.log(`Client compiled to ${path}`);
    }
}
