import test from "node:test";
import assert from "node:assert";
import { temporaryWrite } from "tempy";
import { $ } from "zx";
import polyfill from "../src/polyfill-node.js";

console.debug("process.version", process.version);
polyfill(import.meta);

test("resolve works with relative paths", () => {
  console.log(import.meta.resolve("../src/resolve-node.js"));
});

test("resolve works with absolute paths", () => {
  const absolute = new URL("../src/resolve-node.js", import.meta.url).pathname;
  console.log(import.meta.resolve(absolute));
});

test("resolve works with complete URLs", () => {
  const complete = new URL("../src/resolve-node.js", import.meta.url).href;
  console.log(import.meta.resolve(complete));
});

test("resolve throws on non-existent paths", () => {
  assert.throws(() => import.meta.resolve("./non-existent.js"));
});

test("resolve works with npm packages", () => {
  console.log(import.meta.resolve("is-odd"));
});

test("resolve works with node: specifiers", () => {
  console.log(import.meta.resolve("node:fs"));
});

test("works with no parentURL", () => {
  const importMeta = { __proto__: null };
  importMeta.url = import.meta.url;
  polyfill(importMeta);
  console.log(importMeta.resolve("../src/resolve-node.js"));
});

// Node.js v16 and v18 don't appear to pass along --loader flags.
if (process.version.startsWith("v20")) {
  test("works with loaders", async () => {
    const f1 = await temporaryWrite(
      `export function resolve(specifier, ctx, next) {
        if (specifier.startsWith("custom:")) {
          return { url: "hello:world", shortCircuit: true };
        }
        return next(specifier, ctx);
      }`,
      { extension: ".mjs" },
    );

    const u = new URL("../src/polyfill-node.js", import.meta.url).href;
    const f2 = await temporaryWrite(
      `import polyfill from ${JSON.stringify(u)};
      polyfill(import.meta);
      console.log(import.meta.resolve("custom:foo"));`,
      { extension: ".mjs" },
    );

    console.log((await $`node --loader=${f1} ${f2}`).stdout);
  });
}
