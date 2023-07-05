import { Bench } from "tinybench";
import applyResolvePolyfill from "./index.js";

const importMeta = applyResolvePolyfill({ url: import.meta.url });

const bench = new Bench({ time: 1000 });

console.debug("process.version", process.version);
if (import.meta.resolve && !import.meta.resolve("data:,").then) {
  bench.add("native resolve() import.meta.url", () => {
    import.meta.resolve(import.meta.url);
  });
}

bench.add("resolve() import.meta.url", () => {
  importMeta.resolve(import.meta.url);
});

bench.add("new URL() import.meta.url", () => {
  new URL(import.meta.url, import.meta.url).href;
});

await bench.run();
console.table(bench.table());
