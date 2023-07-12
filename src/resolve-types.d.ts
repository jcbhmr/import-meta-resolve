/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve
 * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
 * @see https://bun.sh/docs/api/import-meta
 * @see https://deno.land/manual/runtime/import_meta_api
 */
function resolve(importMeta: ImportMeta, specifier: string): string;
/**
 * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
 * @experimental
 */
function resolve(
  importMeta: ImportMeta,
  specifier: string,
  parentURL?: string
): string;

export default resolve;
