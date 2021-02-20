import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";
import { NetworkObject } from "../../server/.export.ts";

export class SyncObjectList extends RGL.Package.Base {
    objectList: NetworkObject[];

    constructor(objectList: NetworkObject[]) {
        super(RGL.Package.Type.SyncObjectList);

        this.objectList = objectList;
    }

    /*static from(data: ByteSet): SyncObjectList {
        const list = [];
        const amount = data.read.uint16();

        for (let i = 0; i < amount; i++) {
            list.push({
                id: data.read.uint16(),
                shaderId: data.read.uint8(),
                index: data.read.uint8Array(6),
                vertex: data.read.float32Array(8),
                uv: data.read.float32Array(8),
                textureUrl: data.read.string(),
            });
        }

        return new SyncObjectList(list);
    }*/

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.objectList.forEach((x) => {
            totalLength += 2; // id
            totalLength += 1; // shader id
            totalLength += 2; // texture id
            totalLength += x.index.length * 2; // index
            totalLength += x.vertex.length * 4; // vertex
            totalLength += x.uv.length * 4; // uv
            // totalLength += 4 + x.textureUrl.length; // str len + texture length
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.objectList.length); // object list max 65536

        this.objectList.forEach((x) => {
            this.data.write.uint16(x.id); // object id
            this.data.write.uint8(x.shaderId); // shader id
            this.data.write.uint16(x.textureId); // shader id
            this.data.write.uint16Array(x.index); // index
            this.data.write.float32Array(x.vertex); // vertex
            this.data.write.float32Array(x.uv); // uv
            // this.data.write.string(x.textureUrl); // texture url
        });

        return this.buffer;
    }
}
