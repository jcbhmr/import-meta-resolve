import { Bench } from "tinybench";
import importMetaResolve from "../src/lib/importMetaResolve.js";

console.debug("process.version", process.version);
const majorVersion = +process.version.match(/^v(\d+)/)[1];
if (majorVersion < 20) {
  console.error("Not running since no native sync import.meta.resolve");
  process.exit(0);
}

const nativeResolve = import.meta.resolve;
const myResolve = importMetaResolve.bind(import.meta);

const bench = new Bench();
bench.addEventListener("error", (e) => {
  throw e.error;
});

bench.add("native resolve() | import.meta.url", () => {
  nativeResolve(import.meta.url);
});
bench.add("my resolve() | import.meta.url", () => {
  myResolve(import.meta.url);
});

bench.add("native resolve() | 'is-odd'", () => {
  nativeResolve("is-odd");
});
bench.add("my resolve() | 'is-odd'", () => {
  myResolve("is-odd");
});

await bench.run();
console.table(bench.table());
