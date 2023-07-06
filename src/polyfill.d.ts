declare global {
  interface ImportMeta {
    resolve?(s: string, p?: string | URL): string;
  }
}

declare function polyfill(importMeta: ImportMeta): void;
export default polyfill;
