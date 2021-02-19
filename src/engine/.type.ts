export type RenderoObjectInfo = {
    id?: number;
    shaderId?: number;
    textureId?: number;
    x?: number;
    y?: number;
    zIndex?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
};

export type TextureCropArea = {
    x: number;
    y: number;
    width: number;
    height: number;
    textureWidth: number;
    textureHeight: number;
};
