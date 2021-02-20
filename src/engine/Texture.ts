import { ImageType } from "../../../image/src/Image.ts";
import { Image } from "../../deps.ts";

export class Texture {
    id = 0;
    isInit = false;
    isLoaded = false;
    isAlpha = false;
    isDestroyed = false;
    width = 0;
    height = 0;

    readonly path: string;

    private _buffer!: Uint8Array;

    constructor(path: string) {
        this.path = path;
    }

    async load() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;

        this._buffer = await Deno.readFile(this.path);

        // Set resulotion
        //const type = await Image.typeOf(this._buffer);
        const r = await Image.resolution(this._buffer);

        this.width = r.width || 1920;
        this.height = r.height || 1080;

        // Has alpha
        /*if (type === ImageType.PNG) {
            this.isAlpha = true;
        }*/

        this.isLoaded = true;
    }

    destroy() {
        this.isDestroyed = true;
    }

    get buffer() {
        return this._buffer;
    }
}
