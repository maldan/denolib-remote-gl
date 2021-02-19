import { ByteSet, LengthType } from "../../../deps.ts";

import { RGL } from "../../../mod.ts";

export class Init extends RGL.Server.Package.Base {
    constructor() {
        super(RGL.Server.Package.Type.Init);
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
