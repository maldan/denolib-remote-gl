import { ByteSet } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class Base {
    type: RGL.Package.Type;
    data: ByteSet;

    constructor(type: RGL.Package.Type) {
        this.type = type;
        this.data = new ByteSet(0);
    }

    get buffer(): Uint8Array {
        return this.data.buffer;
    }

    static from(data: ByteSet): Base {
        return new Base(RGL.Package.Type.None);
    }

    pack(): Uint8Array {
        return new Uint8Array();
    }
}
