declare global {
  interface ImportMeta {
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve
     * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
     * @see https://bun.sh/docs/api/import-meta
     * @see https://deno.land/manual/runtime/import_meta_api
     */
    resolve?(importMeta: ImportMeta, specifier: string): string;
    /**
     * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
     * @experimental
     */
    resolve?(
      importMeta: ImportMeta,
      specifier: string,
      parentURL?: string,
    ): string;
  }
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve
 * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
 * @see https://bun.sh/docs/api/import-meta
 * @see https://deno.land/manual/runtime/import_meta_api
 */
function polyfill(importMeta: ImportMeta): void;

export default polyfill;
