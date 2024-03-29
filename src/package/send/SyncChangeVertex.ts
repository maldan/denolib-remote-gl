import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

// deno-lint-ignore camelcase
export type Type_ChangeVertex = {
    id: number;
    vertex: Float32Array;
};

export class SyncChangeVertex extends RGL.Package.Base {
    /*changeList: Type_ChangeVertex[];

    constructor(changeList: Type_ChangeVertex[]) {
        super(RGL.Package.Type.SyncChangeVertex);

        this.changeList = changeList;
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.changeList.forEach((x) => {
            totalLength += 2; // id
            totalLength += x.vertex.length * 2; // vertex
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.changeList.length); // Max 65536 elements

        this.changeList.forEach((x) => {
            this.data.write.uint16(x.id); // object id
            this.data.write.int16Array(new Int16Array(x.vertex.map((y) => (y * 4096) | 0))); // vertex
            // this.data.write.floatArray(x.vertex); // vertex
        });

        return this.buffer;
    }*/
}
