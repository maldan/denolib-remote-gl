import { ByteSet, LengthType } from "../../../deps.ts";

import { RGL } from "../../../mod.ts";

export class Base {
    type: RGL.Server.Package.Type;
    data: ByteSet;

    constructor(type: RGL.Server.Package.Type) {
        this.type = type;
        this.data = new ByteSet(0);
    }

    get buffer(): Uint8Array {
        return this.data.buffer;
    }

    static from(data: ByteSet): Base {
        return new Base(RGL.Server.Package.Type.None);
    }

    pack(): Uint8Array {
        return new Uint8Array();
    }
}
