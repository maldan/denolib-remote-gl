import { ByteSet, EArray, WebSocket } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class Session {
    readonly scene: RGL.Engine.Scene;
    readonly input: RGL.Server.Input = new RGL.Server.Input();
    readonly userList: Set<RGL.Server.User> = new Set();

    constructor() {
        this.scene = new RGL.Engine.Scene(this);
    }

    addUser(user: RGL.Server.User) {
        this.userList.add(user);
    }

    removeUser(user: RGL.Server.User) {
        this.userList.delete(user);
    }

    async syncShaderList() {
        // Get all system shaders
        const shaders = [new RGL.Engine.Shader()];

        // Send to each user
        for (const user of this.userList) {
            await user.synShaderList(shaders);
        }
    }

    async syncObjectList() {
        // Get all objects
        const objectList = this.scene.drawableObjectList.map(
            (x) => new RGL.Server.NetworkObject(x)
        );

        // Send to each user
        for (const user of this.userList) {
            await user.syncObjectList(objectList);
        }
    }

    async syncTextureList() {
        const textureList = this.scene.textureList.filter((x) => !x.isDestroyed);
        const textureDeletedList = this.scene.textureList.filter((x) => x.isDestroyed);

        // Send to each user
        for (const user of this.userList) {
            await user.syncTextureList(textureList);
        }

        // Send to each user
        for (const user of this.userList) {
            await user.syncDeleteTextureList(textureDeletedList);
        }

        this.scene.textureList = this.scene.textureList.filter((x) => !x.isDestroyed);
    }

    async draw() {
        // Send to each user
        for (const user of this.userList) {
            await user.draw();
        }
    }

    async sync() {
        await this.syncShaderList();
        await this.syncTextureList();
        await this.syncObjectList();
        await this.syncChangeList();
    }

    /*async syncAdded() {
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
    }*/

    async syncChangeList() {
        // Check changes
        this.scene.objectFlatList.forEach((x) => x.checkChanges());

        // Get only changed objects
        const changes = this.scene.changedObjectList;

        // No changes
        if (!changes.length) return;

        // Send to each user
        for (const user of this.userList) {
            await user.syncChangeList(changes.filter((x) => x.isOnScreen && x.isChanged));
        }

        // Send change that only on screen
        /* await this.broadcast(
            new RGL.Package.SyncChangeVertex(
               
            )
        );

        const textureChanged = changes
            .filter((x) => x.isOnScreen && x.isTextureChanged)
            .map((x) => {
                if (!x.mesh) {
                    throw new Error(`Mesh not found!`);
                }
                return {
                    id: x.id,
                    textureId: x.texture?.id as number,
                };
            });

        if (textureChanged.length) {
            console.log(textureChanged);
            // Send change that only on screen
            await this.broadcast(new RGL.Package.SyncChangeTexture(textureChanged));
            // await this.syncTextureList();
        }

        // Check if object on screen
        this.scene.objectList.forEach((x) => {
            // x.checkOnScreen();
        });*/
    }
}
