import { ByteSet } from "../../../../bytearray/mod.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export type Type_ObjectInfo = {
    id: number;
    shaderId: number;
    index: Uint8Array;
    vertex: Float32Array;
    uv: Float32Array;
    textureUrl: string;
};

// deno-lint-ignore camelcase
export class Package_SyncAdd extends Package_Base {
    objectList: Type_ObjectInfo[];

    constructor(objectList: Type_ObjectInfo[]) {
        super(RGL_PackageType.SyncAdd);

        this.objectList = objectList;
    }

    static from(data: ByteSet): Package_SyncAdd {
        const list = [];
        const amount = data.read.uint16();

        for (let i = 0; i < amount; i++) {
            list.push({
                id: data.read.uint16(),
                shaderId: data.read.uint8(),
                index: data.read.uint8Array(6),
                vertex: data.read.floatArray(8),
                uv: data.read.floatArray(8),
                textureUrl: data.read.string(),
            });
        }

        return new Package_SyncAdd(list);
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.objectList.forEach((x) => {
            totalLength += 2; // id
            totalLength += 1; // shader id
            totalLength += x.index.length; // index
            totalLength += x.vertex.length * 4; // vertex
            totalLength += x.uv.length * 4; // uv
            totalLength += 4 + x.textureUrl.length; // str len + texture length
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.objectList.length); // object list max 65536

        this.objectList.forEach((x) => {
            this.data.write.uint16(x.id); // object id
            this.data.write.uint8(x.shaderId); // shader id
            this.data.write.uint8Array(x.index); // index
            this.data.write.floatArray(x.vertex); // vertex
            this.data.write.floatArray(x.uv); // uv
            this.data.write.string(x.textureUrl); // texture url
        });

        return this.buffer;
    }
}
