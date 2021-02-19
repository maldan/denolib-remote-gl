import { ByteSet, LengthType } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class SyncDelete extends RGL.Server.Package.Base {
    objectList: number[] = [];

    constructor(objectList: number[]) {
        super(RGL.Server.Package.Type.SyncDelete);

        this.objectList = objectList;
    }

    static from(data: ByteSet): SyncDelete {
        const list = [];
        const amount = data.read.uint16();

        for (let i = 0; i < amount; i++) {
            list.push(data.read.uint16());
        }

        return new SyncDelete(list);
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.objectList.forEach((x) => {
            totalLength += 2; // id
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.objectList.length); // object list max 65536

        this.objectList.forEach((x) => {
            this.data.write.uint16(x); // object id
        });

        return this.buffer;
    }
}
