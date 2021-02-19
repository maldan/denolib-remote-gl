import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";

import { RGL } from "../mod.ts";
import { RenderObject } from "../src/engine/.export.ts";

Deno.test("base render object", () => {
    const r = new RenderObject({ id: 1, x: 10, y: 20 });
    assertEquals(r.id, 1);
    assertEquals(r.shaderId, 0);
    assertEquals(r.x, 10);
    assertEquals(r.y, 20);
});
