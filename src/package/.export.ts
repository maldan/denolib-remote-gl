export { UserEventKeyUp } from "./UserEventKeyUp.ts";
export { UserEventKeyDown } from "./UserEventKeyDown.ts";
export { SyncShaderList } from "./SyncShaderList.ts";
export { SyncObjectList } from "./SyncObjectList.ts";
export { SyncDelete } from "./SyncDelete.ts";
export { SyncChangeVertex } from "./SyncChangeVertex.ts";
export { SyncAdd } from "./SyncAdd.ts";
export { ResizeScreen } from "./ResizeScreen.ts";
export { Init } from "./Init.ts";
export { Base } from "./Base.ts";
export { parse } from "./Package.ts";

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
