import { ByteSet, LengthType } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class EventKeyUp extends RGL.Package.Base {
    code = "";
    keyCode = 0;

    constructor(code: string, keyCode: number) {
        super(RGL.Package.Type.EventKeyUp);

        this.code = code;
        this.keyCode = keyCode;
    }

    static from(data: ByteSet): EventKeyUp {
        return new EventKeyUp(data.read.string(LengthType.Uint16), data.read.uint16());
    }

    pack(): Uint8Array {
        this.data = new ByteSet(1 + 4 + new TextEncoder().encode(this.code).length + 2);
        this.data.write.uint8(this.type); // package type
        this.data.write.string(this.code, LengthType.Uint16);
        this.data.write.uint16(this.keyCode);
        return this.buffer;
    }
}
