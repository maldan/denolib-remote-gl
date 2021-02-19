export { Base } from "./Base.ts";

// Receive
export { Init } from "./receive/Init.ts";
export { UserEventKeyUp } from "./receive/UserEventKeyUp.ts";
export { UserEventKeyDown } from "./receive/UserEventKeyDown.ts";
export { ResizeScreen } from "./receive/ResizeScreen.ts";

// Send
export { SyncShaderList } from "./send/SyncShaderList.ts";
export { SyncObjectList } from "./send/SyncObjectList.ts";
export { SyncDelete } from "./send/SyncDelete.ts";
export { SyncChangeVertex } from "./send/SyncChangeVertex.ts";
export { SyncAdd } from "./send/SyncAdd.ts";

// Parse packages
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
