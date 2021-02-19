import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
// deno-lint-ignore camelcase
import { RGL_Object } from "../src/engine/RGL_Object.ts";
// deno-lint-ignore camelcase
import { Type_ObjectInfo } from "../src/server/package/Package_SyncAdd.ts";
// deno-lint-ignore camelcase
import { Package_Init, Package_ResizeScreen, Package_SyncAdd } from "../src/server/RGL_Package.ts";
// deno-lint-ignore camelcase
import { RGL_Session } from "../src/server/RGL_Session.ts";

// Simple name and function, compact form, but not configurable
Deno.test("hello world #1", () => {
    const session = new RGL_Session();
    session.scene.add(new RGL_Object());

    new Package_Init().pack();
    new Package_ResizeScreen(32, 32).pack();
    new Package_SyncAdd([]).pack();
});
