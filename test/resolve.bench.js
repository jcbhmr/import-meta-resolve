import { Bench } from "tinybench";
import resolve from "../src/lib/resolve.js";

const bench = new Bench({ time: 1000 });

console.debug("process.version", process.version);
if (import.meta.resolve && !import.meta.resolve("data:,").then) {
  bench.add("native resolve() import.meta.url", () => {
    import.meta.resolve(import.meta.url);
  });
} else {
  console.log(
    "Run this on Node.js v20 with --experimental-import-meta-resolve to " +
      "compare against the native import.meta.resolve() sync API."
  );
}

bench.add("worker resolve() import.meta.url", () => {
  resolve(import.meta.url);
});

bench.add("new URL() import.meta.url", () => {
  new URL(import.meta.url, import.meta.url).href;
});

await bench.run();
console.table(bench.table());
