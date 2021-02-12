import { WebSocket, Http } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { GL_Session } from "./GL_Session.ts";

// deno-lint-ignore camelcase
export class GL_Server {
    public readonly session = new GL_Session();

    async handleWs(sock: WebSocket.WebSocket) {
        // Create session
        this.session.addClient(sock);

        try {
            // Read event from socket
            for await (const ev of sock) {
                // Parse package
                if (typeof ev === "string") {
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
        const root = import.meta.url.replace("src/server/GL_Server.ts", "").replace("file:///", "");
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
