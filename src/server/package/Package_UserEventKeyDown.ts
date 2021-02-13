import { ByteSet } from "../../../../bytearray/mod.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export class Package_UserEventKeyDown extends Package_Base {
    code = "";
    keyCode = 0;

    constructor(code: string, keyCode: number) {
        super(RGL_PackageType.UserEventKeyDown);

        this.code = code;
        this.keyCode = keyCode;
    }

    static from(data: ByteSet): Package_UserEventKeyDown {
        return new Package_UserEventKeyDown(data.read.string(), data.read.uint8());
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1 + 4 + this.code.length + 1);
        this.data.write.uint8(this.type); // package type
        this.data.write.string(this.code);
        this.data.write.uint8(this.keyCode);
        return this.buffer;
    }
}
