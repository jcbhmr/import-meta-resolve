import test from "node:test";
import assert from "node:assert";
import { temporaryWrite } from "tempy";
import { $ } from "zx";
import resolve from "../src/resolve-node.js";

test("resolve works with relative paths", () => {
  console.log(resolve(import.meta, "../src/resolve-node.js"));
});

test("resolve works with absolute paths", () => {
  const absolute = new URL("../src/resolve-node.js", import.meta.url).pathname;
  console.log(resolve(import.meta, absolute, import.meta.url));
});

test("resolve works with complete URLs", () => {
  const complete = new URL("../src/resolve-node.js", import.meta.url).href;
  console.log(resolve(import.meta, complete, import.meta.url));
});

test("resolve throws on non-existent paths", () => {
  assert.throws(() =>
    resolve(import.meta, "./non-existent.js", import.meta.url),
  );
});

test("resolve works with npm packages", () => {
  console.log(resolve(import.meta, "is-odd", import.meta.url));
});

test("resolve works with node: specifiers", () => {
  console.log(resolve(import.meta, "node:fs", import.meta.url));
});

test("works with no parentURL", () => {
  console.log(resolve(import.meta, "../src/resolve-node.js"));
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

    const u = new URL("../src/resolve-node.js", import.meta.url).href;
    const f2 = await temporaryWrite(
      `import resolve from ${JSON.stringify(u)};
    console.log(resolve(import.meta, "custom:foo", import.meta.url));`,
      { extension: ".mjs" },
    );

    console.log((await $`node --loader=${f1} ${f2}`).stdout);
  });
}
