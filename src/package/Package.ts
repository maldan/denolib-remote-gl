import { ByteSet } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export function parse(data: Uint8Array) {
    const bytes = ByteSet.from(data);
    const packageType = bytes.read.uint8() as RGL.Package.Type; // Package type

    switch (packageType) {
        case RGL.Package.Type.Init:
            return RGL.Package.Init.from(bytes);
        case RGL.Package.Type.UserEventKeyDown:
            return RGL.Package.UserEventKeyDown.from(bytes);
        case RGL.Package.Type.UserEventKeyUp:
            return RGL.Package.UserEventKeyUp.from(bytes);
        default:
            throw new Error(`Unknown package type ${packageType}`);
    }
}
