import { ByteSet } from "../../../../bytearray/mod.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export class Package_Init extends Package_Base {
    constructor() {
        super(RGL_PackageType.Init);
    }

    static from(data: ByteSet): Package_Init {
        return new Package_Init();
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1); // only package id
        this.data.write.uint8(this.type); // packae type
        return this.buffer;
    }
}
