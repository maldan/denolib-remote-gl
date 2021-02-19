/// <reference lib="dom" />

declare var document: HTMLDocument;

export class Client {
    init(element: string, url: string) {
        // Get canvas
        const canvas = document.querySelector(element) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error("Element not found!");
        }

        // Set full size
        canvas.setAttribute("width", window.innerWidth + "");
        canvas.setAttribute("height", window.innerHeight + "");

        // Initialize the GL context
        const gl = canvas.getContext("webgl", { antialias: true });

        // Only continue if WebGL is available and working
        if (gl === null) {
            throw new Error(
                "Unable to initialize WebGL. Your browser or machine may not support it."
            );
        }
    }
}
