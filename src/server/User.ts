import { EArray, WebSocket } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class User {
    textureIdList: number[] = [];
    objectIdList: number[] = [];
    shaderIdList: number[] = [];

    readonly socket: WebSocket.WebSocket;

    constructor(socket: WebSocket.WebSocket) {
        this.socket = socket;
    }

    async synShaderList(list: RGL.Engine.Shader[]) {
        // Get only shaders client doesn't have
        const filteredList = list.filter((x) => !this.shaderIdList.includes(x.id));

        // If have any
        if (filteredList.length) {
            // Store sended shaders id
            this.shaderIdList.push(...list.map((x) => x.id));

            // Send package to client
            await this.send(new RGL.Package.ShaderList(filteredList));
        }
    }

    async syncObjectList(list: RGL.Server.NetworkObject[]) {
        // Get only objects client doesn't have
        const filteredList = list.filter((x) => !this.objectIdList.includes(x.id));

        // If have any
        if (filteredList.length) {
            // Store sended shaders id
            this.objectIdList.push(...list.map((x) => x.id));

            // Send package to client
            await this.send(new RGL.Package.ObjectList(filteredList));
        }
    }

    async syncTextureList(list: RGL.Engine.Texture[]) {
        // Get only objects client doesn't have
        const filteredList = list; //list.filter((x) => !this.textureIdList.includes(x.id));

        // If have any
        if (filteredList.length) {
            // Store sended shaders id
            this.textureIdList.push(...list.map((x) => x.id));

            const chunk = EArray(filteredList).chunk(5);

            // Send package to client
            for (let i = 0; i < chunk.length; i++) {
                await this.send(new RGL.Package.TextureList(chunk[i]));
            }
        }
    }

    async syncDeleteTextureList(list: RGL.Engine.Texture[]) {
        // If have any
        if (list.length) {
            // Send package to client
            await this.send(new RGL.Package.DeleteTexture(list));
            EArray(this.textureIdList).delete(...list.map((x) => x.id));
        }
    }

    async syncChangeList(list: RGL.Engine.RenderObject[]) {
        if (list.length) {
            await this.send(new RGL.Package.UpdateObject(list));
        }

        /*const vertexChangeList = [];
        const textureChangeList = [];

        for (let i = 0; i < list.length; i++) {
            const obj = list[i];

            // Vertex change
            if (obj.isVertexChanged && obj.mesh) {
                vertexChangeList.push({
                    id: obj.id,
                    vertex: obj.mesh?.vertex as Float32Array,
                });
            }

            // Texture change
            if (obj.isTextureChanged && obj.mesh) {
                textureChangeList.push({
                    id: obj.id,
                    textureId: obj.texture?.id as number,
                });
            }
        }
        if (vertexChangeList.length) {
            this.send(new RGL.Package.SyncChangeVertex(vertexChangeList));
        }
        if (textureChangeList.length) {
            this.send(new RGL.Package.SyncChangeTexture(textureChangeList));
        }*/
    }

    async draw() {
        await this.send(new RGL.Package.Draw());
    }

    async send(pack: RGL.Package.Base) {
        try {
            await this.socket.send(pack.pack());
        } catch {
            // Error
        }
    }
}
