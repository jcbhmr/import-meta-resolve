declare global {
  interface ImportMeta {
    resolve?(s: string, p?: string | URL): string;
  }
}

declare function d(i: ImportMeta): ImportMeta;
export default d;
