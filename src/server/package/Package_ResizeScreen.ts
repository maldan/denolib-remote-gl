import { ByteSet, LengthType } from "../../../client.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export class Package_ResizeScreen extends Package_Base {
    width = 0;
    height = 0;

    constructor(width: number, height: number) {
        super(RGL_PackageType.ResizeScreen);

        this.width = width;
        this.height = height;
    }

    static from(data: ByteSet): Package_ResizeScreen {
        return new Package_ResizeScreen(data.read.uint16(), data.read.uint16());
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1 + 2 + 2);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.width);
        this.data.write.uint16(this.height);
        return this.buffer;
    }
}
