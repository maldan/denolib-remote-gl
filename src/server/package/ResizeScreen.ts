import { ByteSet, LengthType } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class ResizeScreen extends RGL.Server.Package.Base {
    width = 0;
    height = 0;

    constructor(width: number, height: number) {
        super(RGL.Server.Package.Type.ResizeScreen);

        this.width = width;
        this.height = height;
    }

    static from(data: ByteSet): ResizeScreen {
        return new ResizeScreen(data.read.uint16(), data.read.uint16());
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1 + 2 + 2);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.width);
        this.data.write.uint16(this.height);
        return this.buffer;
    }
}
