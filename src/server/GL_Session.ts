import { ByteSet, WebSocket } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { GL_Object } from "./../engine/GL_Object.ts";
// deno-lint-ignore camelcase
import { GL_Scene } from "./../engine/GL_Scene.ts";
// deno-lint-ignore camelcase
import { GL_Shader } from "./../engine/GL_Shader.ts";
// deno-lint-ignore camelcase
import { GL_Input } from "./GL_Input.ts";

// deno-lint-ignore camelcase
export class GL_Session {
    readonly scene: GL_Scene;
    private _clientList: Set<WebSocket.WebSocket> = new Set();
    readonly input: GL_Input = new GL_Input();

    constructor() {
        this.scene = new GL_Scene(this);
    }

    addClient(client: WebSocket.WebSocket) {
        this._clientList.add(client);
    }

    removeClient(client: WebSocket.WebSocket) {
        this._clientList.delete(client);
    }

    async broadcast(data: { [x: string]: unknown } | Uint8Array) {
        for await (const client of this._clientList) {
            try {
                if (data instanceof Uint8Array) {
                    await client.send(data);
                } else {
                    await client.send(JSON.stringify(data));
                }
            } catch {
                //
            }
        }
    }

    resize(width: number, height: number) {
        this.scene.camera.width = width;
        this.scene.camera.height = height;
    }

    async syncShaders() {
        // Get all shaders
        const shaders: GL_Shader[] = [];
        for (let i = 0; i < this.scene.objectList.length; i++) {
            const obj = this.scene.objectList[i];
            if (!shaders.find((x) => x.id === obj.shader.id)) {
                shaders.push(obj.shader);
            }
        }

        // Broadcast shaders
        await this.broadcast({
            type: "shaders",
            data: shaders,
        });
    }

    async syncObjects() {
        await this.broadcast({
            type: "objects",
            data: this.scene.objectList.map((x) => {
                return {
                    id: x.id,
                    shaderId: x.shader.id,
                    index: x.mesh.index,
                    vertex: x.mesh.vertex,
                    uv: x.mesh.uv,
                    tint: x.mesh.tint,
                    textureUrl: x.textureUrl,
                };
            }),
        });
    }

    async syncChanges() {
        const changes = this.scene.getChangedObjects();
        const bytes = new ByteSet(1 + 2 + changes.length * 8 * 4 + changes.length * 4);
        bytes.write.uint8(1); // package id
        bytes.write.uint16(changes.length); // object amount

        for (let i = 0; i < changes.length; i++) {
            bytes.write.uint16(changes[i].id); // object id
            bytes.write.uint16(changes[i].mesh.vertex.length); // vertex length
            bytes.write.floatArray(new Float32Array(changes[i].mesh.vertex));
        }

        await this.broadcast(bytes.buffer);
    }

    async sync() {
        await this.syncShaders();
        await this.syncObjects();
    }
}
