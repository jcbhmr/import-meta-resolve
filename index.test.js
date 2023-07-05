import test from "node:test";
import assert from "node:assert";
import applyResolvePolyfill from "./index.js";

const importMeta = applyResolvePolyfill({ url: import.meta.url });

test("resolve works with relative paths", () => {
  console.log(importMeta.resolve("./index.js"));
});

test("resolve works with absolute paths", () => {
  const absolute = new URL("./index.js", import.meta.url).pathname;
  console.log(importMeta.resolve(absolute));
});

test("resolve works with complete URLs", () => {
  const complete = new URL("./index.js", import.meta.url).href;
  console.log(importMeta.resolve(complete));
});

test("resolve throws on non-existent paths", () => {
  assert.throws(() => importMeta.resolve("./non-existent.js"));
});

test("resolve works with npm packages", () => {
  console.log(importMeta.resolve("is-odd"));
});

test("resolve works with node: specifiers", () => {
  console.log(importMeta.resolve("node:fs"));
});
