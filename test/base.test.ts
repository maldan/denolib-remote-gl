import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";

import { RGL } from "../mod.ts";

Deno.test("base render object", () => {
    const r = new RGL.Engine.RenderObject({ id: 1, x: 10, y: 20 });
    assertEquals(r.id, 1);
    assertEquals(r.x, 10);
    assertEquals(r.y, 20);
});

Deno.test("sprite", () => {
    const r = new RGL.Engine.Sprite({ width: 32, height: 32 });
    assertEquals(r.width, 32);
    assertEquals(r.height, 32);
});
