import { ByteSet, WebSocket } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class Session {
    readonly scene: RGL.Engine.Scene;
    private _clientList: Set<WebSocket.WebSocket> = new Set();
    //readonly input: Server.Input = new Server.Input();

    constructor() {
        this.scene = new RGL.Engine.Scene(this);
    }

    addClient(client: WebSocket.WebSocket) {
        this._clientList.add(client);
    }

    removeClient(client: WebSocket.WebSocket) {
        this._clientList.delete(client);
    }

    async broadcast(pack: RGL.Package.Base) {
        const data = pack.pack();
        for await (const client of this._clientList) {
            try {
                await client.send(data);
            } catch {
                //
            }
        }
    }

    async syncShaderList() {
        // Get all shaders
        /*const shaders: RGL.Engine.Shader[] = [];
        const objectList = this.scene.drawableObjects;
        objectList.forEach((obj) => {
            if (!shaders.find((y) => y.id === obj.shader.id)) {
                shaders.push(obj.shader);
            }
        });*/

        await this.broadcast(new RGL.Package.SyncShaderList([new RGL.Engine.Shader()]));
    }

    /*async syncObjectList() {
        await this.broadcast(
            new Server.Package.SyncObjectList(
                this.scene.drawableObjects.map((x) => {
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
            new Server.Package.SyncAdd(
                this.scene.added.map((y) => {
                    const x = this.scene.drawableObjects.find((x) => x.id === y);
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
        await this.broadcast(new Server.Package.SyncDelete(this.scene.deleted));
        this.scene.deleted.length = 0;
        this.scene.clearDeleted();
    }

    async syncChangeList() {
        // Get only changed objects
        const changes = this.scene.changedObjects;

        if (!changes.length) return;

        // Send change that only on screen
        await this.broadcast(
            new Server.Package.SyncChangeVertex(
                changes
                    .filter((x) => x.isOnScreen)
                    .map((x) => {
                        return {
                            id: x.id,
                            vertex: x.mesh.vertex,
                        };
                    })
            )
        );

        // Check if object on screen
        this.scene.objectList.forEach((x) => {
            x.checkOnScreen();
        });
    }*/
}
