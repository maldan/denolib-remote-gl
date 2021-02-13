import { ByteSet } from "../../client.deps.ts";

// deno-lint-ignore camelcase
import { Package_Init } from "./package/Package_Init.ts";
export { Package_Init } from "./package/Package_Init.ts";

// deno-lint-ignore camelcase
import { Package_ResizeScreen } from "./package/Package_ResizeScreen.ts";
export { Package_ResizeScreen } from "./package/Package_ResizeScreen.ts";

// deno-lint-ignore camelcase
import { Package_SyncAdd } from "./package/Package_SyncAdd.ts";
export { Package_SyncAdd } from "./package/Package_SyncAdd.ts";

// deno-lint-ignore camelcase
import { Package_SyncChangeVertex } from "./package/Package_SyncChangeVertex.ts";
export { Package_SyncChangeVertex } from "./package/Package_SyncChangeVertex.ts";

// deno-lint-ignore camelcase
import { Package_SyncDelete } from "./package/Package_SyncDelete.ts";
export { Package_SyncDelete } from "./package/Package_SyncDelete.ts";

// deno-lint-ignore camelcase
import { Package_SyncObjectList } from "./package/Package_SyncObjectList.ts";
export { Package_SyncObjectList } from "./package/Package_SyncObjectList.ts";

// deno-lint-ignore camelcase
import { Package_SyncShaderList } from "./package/Package_SyncShaderList.ts";
export { Package_SyncShaderList } from "./package/Package_SyncShaderList.ts";

// deno-lint-ignore camelcase
import { Package_UserEventKeyDown } from "./package/Package_UserEventKeyDown.ts";
export { Package_UserEventKeyDown } from "./package/Package_UserEventKeyDown.ts";

// deno-lint-ignore camelcase
import { Package_UserEventKeyUp } from "./package/Package_UserEventKeyUp.ts";
export { Package_UserEventKeyUp } from "./package/Package_UserEventKeyUp.ts";

// deno-lint-ignore camelcase
export enum RGL_PackageType {
    // Base
    None = 0,
    Init = 1,
    ResizeScreen = 2,

    // Server sync object & object params
    SyncShaderList = 10,
    SyncObjectList = 11,
    SyncChangeVertex = 13,
    SyncChangeTexture = 14,
    SyncAdd = 15,
    SyncDelete = 16,

    // User event
    UserEventMouseDown = 40,
    UserEventMouseUp = 41,
    UserEventClick = 42,
    UserEventKeyDown = 43,
    UserEventKeyUp = 44,
    UserEventZoom = 45,
    UserEventRotation = 46,
    UserEventTranslation = 47,
    UserEventResizeScreen = 48,
}

// deno-lint-ignore camelcase
export function RGL_ParsePackage(data: Uint8Array) {
    const bytes = ByteSet.from(data);
    const packageType = bytes.read.uint8() as RGL_PackageType; // Package type

    switch (packageType) {
        case RGL_PackageType.Init:
            return Package_Init.from(bytes);
        case RGL_PackageType.SyncShaderList:
            return Package_SyncShaderList.from(bytes);
        case RGL_PackageType.SyncObjectList:
            return Package_SyncObjectList.from(bytes);
        case RGL_PackageType.SyncChangeVertex:
            return Package_SyncChangeVertex.from(bytes);
        case RGL_PackageType.SyncAdd:
            return Package_SyncAdd.from(bytes);
        case RGL_PackageType.SyncDelete:
            return Package_SyncDelete.from(bytes);
        case RGL_PackageType.UserEventKeyDown:
            return Package_UserEventKeyDown.from(bytes);
        case RGL_PackageType.UserEventKeyUp:
            return Package_UserEventKeyUp.from(bytes);
        case RGL_PackageType.ResizeScreen:
            return Package_ResizeScreen.from(bytes);
        default:
            throw new Error(`Unknown package type ${packageType}`);
    }
}
