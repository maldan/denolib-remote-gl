import { ByteSet } from "../../deps.ts";

import { Base } from "./package/Base.ts";
export { Base } from "./package/Base.ts";

import { Init } from "./package/Init.ts";
export { Init } from "./package/Init.ts";

import { ResizeScreen } from "./package/ResizeScreen.ts";
export { ResizeScreen } from "./package/ResizeScreen.ts";

import { SyncAdd } from "./package/SyncAdd.ts";
export { SyncAdd } from "./package/SyncAdd.ts";

import { SyncChangeVertex } from "./package/SyncChangeVertex.ts";
export { SyncChangeVertex } from "./package/SyncChangeVertex.ts";

import { SyncDelete } from "./package/SyncDelete.ts";
export { SyncDelete } from "./package/SyncDelete.ts";

import { SyncObjectList } from "./package/SyncObjectList.ts";
export { SyncObjectList } from "./package/SyncObjectList.ts";

import { UserEventKeyDown } from "./package/UserEventKeyDown.ts";
export { UserEventKeyDown } from "./package/UserEventKeyDown.ts";

import { UserEventKeyUp } from "./package/UserEventKeyUp.ts";
export { UserEventKeyUp } from "./package/UserEventKeyUp.ts";

export enum Type {
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

export function parse(data: Uint8Array) {
    const bytes = ByteSet.from(data);
    const packageType = bytes.read.uint8() as Type; // Package type

    switch (packageType) {
        case Type.Init:
            return Init.from(bytes);
        /*case Type.SyncShaderList:
            return SyncShaderList.from(bytes);*/
        case Type.SyncObjectList:
            return SyncObjectList.from(bytes);
        case Type.SyncChangeVertex:
            return SyncChangeVertex.from(bytes);
        case Type.SyncAdd:
            return SyncAdd.from(bytes);
        case Type.SyncDelete:
            return SyncDelete.from(bytes);
        case Type.UserEventKeyDown:
            return UserEventKeyDown.from(bytes);
        case Type.UserEventKeyUp:
            return UserEventKeyUp.from(bytes);
        case Type.ResizeScreen:
            return ResizeScreen.from(bytes);
        default:
            throw new Error(`Unknown package type ${packageType}`);
    }
}
