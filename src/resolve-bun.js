export default function resolve(importMeta, specifier, parentURL = undefined) {
  return importMeta.resolveSync(specifier, parentURL);
}
