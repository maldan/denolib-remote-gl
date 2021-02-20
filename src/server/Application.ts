import { WebSocket, Http } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class Application {
    readonly session = new RGL.Server.Session();

    readonly event: RGL.Engine.EventEmitter<RGL.Server.Session> = new RGL.Engine.EventEmitter(
        this.session
    );

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
                    const p = RGL.Package.parse(ev);

                    // Client connected and request init data
                    if (p instanceof RGL.Package.Init) {
                        await this.session.syncShaderList();
                        await this.session.syncObjectList();
                    }

                    // User down key
                    /*if (p instanceof RGL.Server.Package.UserEventKeyDown) {
                        this.session.input.keys[p.keyCode] = true;
                    }
                    // User up key
                    if (p instanceof RGL.Server.Package.UserEventKeyUp) {
                        this.session.input.keys[p.keyCode] = false;
                    }
                    // User up key
                    if (p instanceof RGL.Server.Package.ResizeScreen) {
                        this.session.scene.camera.width = p.width;
                        this.session.scene.camera.height = p.height;
                    }*/
                } else if (WebSocket.isWebSocketCloseEvent(ev)) {
                    this.session.removeClient(sock);
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
            .replace("src/server/Application.ts", "")
            .replace("file:///", "");
        console.log(`Client compilation...`);
        const cmd = Deno.run({
            cmd: ["deno", "bundle", "--config", root + "tsconfig.json", root + "client.ts", path],
            //stdout: "piped",
            //stderr: "piped",
        });
        // await its completion
        const { code } = await cmd.status();

        if (code === 0) {
            const rawOutput = await cmd.output();
            console.log(rawOutput);
            // await Deno.stdout.write(rawOutput);
        } else {
            const rawError = await cmd.stderrOutput();
            const errorString = new TextDecoder().decode(rawError);
            console.log(errorString);
        }

        console.log(`Client compiled to ${path}`);
    }
}
