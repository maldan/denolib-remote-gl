export { Base } from "./Base.ts";

// Receive
export { Init } from "./receive/Init.ts";
export { EventKeyUp } from "./receive/EventKeyUp.ts";
export { EventKeyDown } from "./receive/EventKeyDown.ts";
export { ResizeScreen } from "./receive/ResizeScreen.ts";

// Send
export { ShaderList } from "./send/ShaderList.ts";
export { ObjectList } from "./send/ObjectList.ts";
export { TextureList } from "./send/TextureList.ts";
export { DeleteObject } from "./send/DeleteObject.ts";
export { DeleteTexture } from "./send/DeleteTexture.ts";
export { SyncChangeVertex } from "./send/SyncChangeVertex.ts";
export { SyncChangeTexture } from "./send/SyncChangeTexture.ts";
export { AddObject } from "./send/AddObject.ts";
export { UpdateObject } from "./send/UpdateObject.ts";
// export { UpdateTexture } from "./send/UpdateTexture.ts";
export { Draw } from "./send/Draw.ts";

// Parse packages
export { parse } from "./Package.ts";

export enum Type {
    // Base
    None = 0,
    Init = 1,
    ResizeScreen = 2,
    Draw = 3,

    // Sync list
    ShaderList = 10,
    ObjectList = 11,
    TextureList = 12,

    // Sync object
    AddObject = 30,
    DeleteObject = 31,
    DeleteTexture = 32,
    UpdateObject = 33,
    UpdateTexture = 34,

    // User event
    EventMouseDown = 40,
    EventMouseUp = 41,
    EventClick = 42,
    EventKeyDown = 43,
    EventKeyUp = 44,
    EventZoom = 45,
    EventRotation = 46,
    EventTranslation = 47,
    EventResizeScreen = 48,
}
