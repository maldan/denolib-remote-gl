import { ByteSet } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export function parse(data: Uint8Array) {
    const bytes = ByteSet.from(data);
    const packageType = bytes.read.uint8() as RGL.Package.Type; // Package type

    switch (packageType) {
        case RGL.Package.Type.Init:
            return RGL.Package.Init.from(bytes);
        case RGL.Package.Type.SyncShaderList:
            return RGL.Package.SyncShaderList.from(bytes);
        case RGL.Package.Type.SyncObjectList:
            return RGL.Package.SyncObjectList.from(bytes);
        case RGL.Package.Type.SyncChangeVertex:
            return RGL.Package.SyncChangeVertex.from(bytes);
        case RGL.Package.Type.SyncAdd:
            return RGL.Package.SyncAdd.from(bytes);
        case RGL.Package.Type.SyncDelete:
            return RGL.Package.SyncDelete.from(bytes);
        case RGL.Package.Type.UserEventKeyDown:
            return RGL.Package.UserEventKeyDown.from(bytes);
        case RGL.Package.Type.UserEventKeyUp:
            return RGL.Package.UserEventKeyUp.from(bytes);
        case RGL.Package.Type.ResizeScreen:
            return RGL.Package.ResizeScreen.from(bytes);
        default:
            throw new Error(`Unknown package type ${packageType}`);
    }
}
