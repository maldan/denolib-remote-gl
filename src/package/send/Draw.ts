import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class Draw extends RGL.Package.Base {
    constructor() {
        super(RGL.Package.Type.Draw);
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1); // only package id
        this.data.write.uint8(this.type); // packae type
        return this.buffer;
    }
}
