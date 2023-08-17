import importMetaResolve from "./lib/importMetaResolve.js";

export default function resolve(importMeta, specifier, parentURL = undefined) {
  if (importMeta.resolve && !importMeta.resolve("data:,").then) {
    return importMeta.resolve(specifier, parentURL);
  } else {
    return importMetaResolve.call(importMeta, specifier);
  }
}
