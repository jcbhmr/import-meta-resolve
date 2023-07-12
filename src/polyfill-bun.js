// https://bun.sh/docs/api/import-meta
export default function polyfill(importMeta) {
  if (!importMeta.resolve || importMeta.resolve("data:,").then) {
    importMeta.resolve = importMeta.resolveSync;
  }
}
