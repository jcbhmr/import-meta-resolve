import resolve from "./lib/resolve.js";

/** @param {ImportMeta} [importMeta] */
export default function polyfill(importMeta) {
  // @ts-ignore
  if (!importMeta.resolve || importMeta.resolve("data:,").then) {
    // @ts-ignore
    importMeta.resolve = resolve;
  }
}
