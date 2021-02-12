// deno-lint-ignore camelcase
import { GL_Shader } from "../engine/GL_Shader.ts";

// deno-lint-ignore camelcase
export class GL_Material {
    program: WebGLProgram;
    attribute: { [x: string]: number } = {};
    uniform: { [x: string]: WebGLUniformLocation | null } = {};
    private _gl!: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, shader: GL_Shader) {
        this._gl = gl;

        // Load shaders
        const vertexShader = this.load(this._gl.VERTEX_SHADER, shader.vertex);
        const fragmentShader = this.load(this._gl.FRAGMENT_SHADER, shader.fragment);

        // Create program
        this.program = this._gl.createProgram() as WebGLProgram;
        if (!this.program) {
            throw new Error("Can't create shader program");
        }

        // Attack shaders
        this._gl.attachShader(this.program, vertexShader);
        this._gl.attachShader(this.program, fragmentShader);

        // Link program
        this._gl.linkProgram(this.program);

        // Check link status
        if (!this._gl.getProgramParameter(this.program, this._gl.LINK_STATUS)) {
            throw new Error(this._gl.getProgramInfoLog(this.program) + "");
        }

        // Get attribute
        this.attribute["aPosition"] = this._gl.getAttribLocation(this.program, "aPosition");
        this.attribute["aUV"] = this._gl.getAttribLocation(this.program, "aUV");
        this.uniform["uTint"] = this._gl.getUniformLocation(this.program, "uTint");
        this.uniform["uTexture"] = this._gl.getUniformLocation(this.program, "uTexture");

        console.log(`Shader ${shader.id} is compiled and linked!`);
    }

    load(type: number, code: string): WebGLShader {
        // Create shader
        const shader = this._gl.createShader(type);

        if (!shader) {
            throw new Error("Can't compiler shader");
        }

        // Compiler shader
        this._gl.shaderSource(shader, code);
        this._gl.compileShader(shader);

        // Check compilation status
        if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
            const msg =
                "An error occurred compiling the shaders: " + this._gl.getShaderInfoLog(shader);
            this._gl.deleteShader(shader);
            throw new Error(msg);
        }

        return shader;
    }
}
