import worker_threads from "node:worker_threads";

const workerCode = `
import worker_threads from "node:worker_threads";
worker_threads.parentPort.on(
  "message",
  /** @param {[Int32Array, string, string | undefined]} $1 */
  async ([lockBuffer, specifier, parentURL]) => {
    const lock = new Int32Array(lockBuffer);
    /** @type {[string] | [void, any]} */
    // @ts-ignore
    let r = [];
    try {
      r[0] = await import.meta.resolve(specifier, parentURL);
    } catch (e) {
      r[1] = e;
    }
    console.log(r);
    worker_threads.workerData.port.postMessage(r);
    Atomics.store(lock, 0, 1);
    Atomics.notify(lock, 0);
  }
);
`;

/**
 * @type {| {
 *       worker: import("node:worker_threads").Worker;
 *       id: ReturnType<typeof setTimeout>;
 *     }
 *   | null
 *   | undefined}
 */
let cache;
function getWorker() {
  function onTimeout() {
    cache?.worker.terminate();
    cache = null;
  }
  if (!cache) {
    const u =
      "data:text/javascript;base64," +
      Buffer.from(workerCode).toString("base64");
    const worker = new worker_threads.Worker(`import(${JSON.stringify(u)})`, {
      eval: true,
      execArgv: process.execArgv.includes("--experimental-import-meta-resolve")
        ? process.execArgv
        : process.execArgv.concat("--experimental-import-meta-resolve"),
      name: "import-meta-resolve",
    });
    worker.unref();
    const id = setTimeout(onTimeout, 5000);
    id.unref();
    cache = { worker, id };
  } else {
    clearTimeout(cache.id);
    cache.id = setTimeout(onTimeout, 5000);
    cache.id.unref();
  }
  return cache.worker;
}

export default getWorker;
