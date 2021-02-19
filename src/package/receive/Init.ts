import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class Init extends RGL.Package.Base {
    constructor() {
        super(RGL.Package.Type.Init);
    }

    static from(data: ByteSet): Init {
        return new Init();
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1); // only package id
        this.data.write.uint8(this.type); // packae type
        return this.buffer;
    }
}
