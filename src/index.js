import resolve from "./resolve.js";

/**
 * @param {ImportMeta} [importMeta]
 * @returns {ImportMeta}
 */
export default function polyfill(importMeta) {
  // @ts-ignore
  if (!importMeta.resolve || importMeta.resolve("data:,").then) {
    // @ts-ignore
    importMeta.resolve = resolve;
  }
  return importMeta;
}
