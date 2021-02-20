import { RGL } from "../../mod.ts";

export type RenderObjectInfo = {
    id?: number;
    x?: number;
    y?: number;
    zIndex?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    texture?: RGL.Engine.Texture;
    isUseTextureResolution?: boolean;
};

export type TextureCropArea = {
    x: number;
    y: number;
    width: number;
    height: number;
    textureWidth: number;
    textureHeight: number;
};
