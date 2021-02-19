import { ByteSet, LengthType } from "../../../client.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export class Package_UserEventKeyUp extends Package_Base {
    code = "";
    keyCode = 0;

    constructor(code: string, keyCode: number) {
        super(RGL_PackageType.UserEventKeyUp);

        this.code = code;
        this.keyCode = keyCode;
    }

    static from(data: ByteSet): Package_UserEventKeyUp {
        return new Package_UserEventKeyUp(data.read.string(LengthType.Uint16), data.read.uint16());
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1 + 4 + new TextEncoder().encode(this.code).length + 2);
        this.data.write.uint8(this.type); // package type
        this.data.write.string(this.code, LengthType.Uint16);
        this.data.write.uint16(this.keyCode);
        return this.buffer;
    }
}
