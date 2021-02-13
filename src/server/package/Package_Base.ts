import { ByteSet } from "../../../client.deps.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";

// deno-lint-ignore camelcase
export class Package_Base {
    type: RGL_PackageType;
    data: ByteSet;

    constructor(type: RGL_PackageType) {
        this.type = type;
        this.data = new ByteSet(0);
    }

    get buffer(): Uint8Array {
        return this.data.buffer;
    }

    static from(data: ByteSet): Package_Base {
        return new Package_Base(RGL_PackageType.None);
    }

    pack(): Uint8Array {
        return new Uint8Array();
    }
}
