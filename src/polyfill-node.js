import importMetaResolve from "./lib/importMetaResolve-node.js";

export default function polyfill(importMeta) {
  if (!importMeta.resolve || importMeta.resolve("data:,").then) {
    importMeta.resolve = importMetaResolve;
  }
}
