import { ByteSet } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export function parse(data: Uint8Array) {
    const bytes = ByteSet.from(data);
    const packageType = bytes.read.uint8() as RGL.Package.Type; // Package type

    switch (packageType) {
        case RGL.Package.Type.Init:
            return RGL.Package.Init.from(bytes);
        case RGL.Package.Type.ResizeScreen:
            return RGL.Package.ResizeScreen.from(bytes);
        case RGL.Package.Type.EventKeyDown:
            return RGL.Package.EventKeyDown.from(bytes);
        case RGL.Package.Type.EventKeyUp:
            return RGL.Package.EventKeyUp.from(bytes);
        default:
            throw new Error(`Unknown package type ${packageType}`);
    }
}
