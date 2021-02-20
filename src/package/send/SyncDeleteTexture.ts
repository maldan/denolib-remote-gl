import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class SyncDeleteTexture extends RGL.Package.Base {
    textureList: number[] = [];

    constructor(textureList: number[]) {
        super(RGL.Package.Type.SyncDeleteTexture);

        this.textureList = textureList;
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.textureList.forEach((x) => {
            totalLength += 2; // id
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.textureList.length); // object list max 65536

        this.textureList.forEach((x) => {
            this.data.write.uint16(x); // object id
        });

        return this.buffer;
    }
}
