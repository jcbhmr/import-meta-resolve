// https://bun.sh/docs/api/import-meta
export default function polyfill(importMeta) {
  importMeta.resolve = importMeta.resolveSync;
}
