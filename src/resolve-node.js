import importMetaResolve from "./lib/importMetaResolve-node.js";

export default function resolve(importMeta, specifier, parentURL) {
  if (importMeta.resolve && !importMeta.resolve("data:,").then) {
    return importMeta.resolve(specifier, parentURL);
  } else {
    return importMetaResolve.call(importMeta, specifier, parentURL);
  }
}
