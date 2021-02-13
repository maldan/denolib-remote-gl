import { ByteSet, WebSocket } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Object } from "./../engine/RGL_Object.ts";
// deno-lint-ignore camelcase
import { RGL_Scene } from "./../engine/RGL_Scene.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "./../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./package/Package_Base.ts";
// deno-lint-ignore camelcase
import { Package_SyncAdd } from "./package/Package_SyncAdd.ts";
// deno-lint-ignore camelcase
import { Package_SyncChangeVertex } from "./package/Package_SyncChangeVertex.ts";
// deno-lint-ignore camelcase
import { Package_SyncDelete } from "./package/Package_SyncDelete.ts";
// deno-lint-ignore camelcase
import { Package_SyncObjectList } from "./package/Package_SyncObjectList.ts";
// deno-lint-ignore camelcase
import { Package_SyncShaderList } from "./package/Package_SyncShaderList.ts";
// deno-lint-ignore camelcase
import { RGL_Input } from "./RGL_Input.ts";

// deno-lint-ignore camelcase
export class RGL_Session {
    readonly scene: RGL_Scene;
    private _clientList: Set<WebSocket.WebSocket> = new Set();
    readonly input: RGL_Input = new RGL_Input();

    constructor() {
        this.scene = new RGL_Scene(this);
    }

    addClient(client: WebSocket.WebSocket) {
        this._clientList.add(client);
    }

    removeClient(client: WebSocket.WebSocket) {
        this._clientList.delete(client);
    }

    async broadcast(pack: Package_Base) {
        const data = pack.pack();
        for await (const client of this._clientList) {
            try {
                await client.send(data);
            } catch {
                //
            }
        }
    }

    resize(width: number, height: number) {
        this.scene.camera.width = width;
        this.scene.camera.height = height;
    }

    async syncShaderList() {
        // Get all shaders
        const shaders: RGL_Shader[] = [];
        for (let i = 0; i < this.scene.objectList.length; i++) {
            const obj = this.scene.objectList[i];
            if (!shaders.find((x) => x.id === obj.shader.id)) {
                shaders.push(obj.shader);
            }
        }

        await this.broadcast(new Package_SyncShaderList(shaders));
    }

    async syncObjectList() {
        /*{
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
        }*/
        await this.broadcast(
            new Package_SyncObjectList(
                this.scene.objectList.map((x) => {
                    return {
                        id: x.id,
                        shaderId: x.shader.id,
                        index: x.mesh.index,
                        vertex: x.mesh.vertex,
                        uv: x.mesh.uv,
                        // tint: x.mesh.tint,
                        textureUrl: x.textureUrl,
                    };
                })
            )
        );
    }

    async syncAdded() {
        if (!this.scene.added.length) {
            return;
        }
        await this.broadcast(
            new Package_SyncAdd(
                this.scene.added.map((y) => {
                    const x = this.scene.objectList.find((x) => x.id === y);
                    if (!x) throw new Error(`Object not exists!`);
                    return {
                        id: x.id,
                        shaderId: x.shader.id,
                        index: x.mesh.index,
                        vertex: x.mesh.vertex,
                        uv: x.mesh.uv,
                        // tint: x.mesh.tint,
                        textureUrl: x.textureUrl,
                    };
                })
            )
        );
        this.scene.added.length = 0;
    }

    async syncDeleted() {
        if (!this.scene.deleted.length) {
            return;
        }
        await this.broadcast(new Package_SyncDelete(this.scene.deleted));
        this.scene.deleted.length = 0;
        this.scene.clearDeleted();
    }

    async syncChangeList() {
        const changes = this.scene.getChangedObjects();
        //const bytes = new ByteSet(1 + 2 + changes.length * 8 * 4 + changes.length * 4);
        //bytes.write.uint8(1); // package id
        //bytes.write.uint16(changes.length); // object amount

        /*for (let i = 0; i < changes.length; i++) {
            bytes.write.uint16(changes[i].id); // object id
            bytes.write.uint16(changes[i].mesh.vertex.length); // vertex length
            bytes.write.floatArray(new Float32Array(changes[i].mesh.vertex));
        }*/

        await this.broadcast(
            new Package_SyncChangeVertex(
                changes.map((x) => {
                    return {
                        id: x.id,
                        vertex: x.mesh.vertex,
                    };
                })
            )
        );
    }

    /*async sync() {
        await this.syncShaders();
        await this.syncObjects();
    }*/
}
