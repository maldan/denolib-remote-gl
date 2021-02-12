// deno-lint-ignore camelcase
export class GL_Input {
    readonly cursor: {
        x: number;
        y: number;
        isDown: boolean;
    } = { x: 0, y: 0, isDown: false };
}
