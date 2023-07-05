import worker_threads from "node:worker_threads";

let cache;
function getPort() {
  if (!cache) {
    const lock = new Int32Array(new SharedArrayBuffer(4));
    const { port1, port2 } = new MessageChannel();
    port1.unref();
    port2.unref();
    const worker = new worker_threads.Worker(
      `"use strict";(async () => {
        const worker_threads = await import("node:worker_threads");
        const { default: importMeta } = await import("data:text/javascript,export default import.meta");
        const lock = new Int32Array(worker_threads.workerData.lockBuffer);
        worker_threads.workerData.port.on("message", ([specifier, parentURL]) => {
          let returnValue;
          let error;
          let threw = false;
          try {
            returnValue = importMeta.resolve(specifier, parentURL);
          } catch (e) {
            threw = true;
            error = e;
          }
          if (threw) {
            worker_threads.workerData.port.postMessage([, error]);
          } else {
            worker_threads.workerData.port.postMessage([returnValue]);
          }
          Atomics.store(lock, 0, 1);
          Atomics.notify(lock, 0);
        });
      })()`,
      {
        eval: true,
        execArgv: ["--experimental-import-meta-resolve", ...process.execArgv],
        workerData: { lockBuffer: lock.buffer, port: port2 },
        transferList: [port2],
      }
    );
    worker.unref();
    const id = setTimeout(() => {
      cache?.worker.terminate();
      cache = null;
    }, 5000);
    id.unref();
    cache = { worker, lock, port: port1, id };
  } else {
    clearTimeout(cache.id);
    cache.id = setTimeout(() => {
      cache?.worker.terminate();
      cache = null;
    }, 5000);
    cache.id.unref();
  }
  return cache.port;
}

/**
 * @param {string} specifier
 * @param {string} [parentURL]
 * @returns {string}
 * @this {ImportMeta | null | undefined}
 */
function resolve(specifier, parentURL = undefined) {
  if (parentURL == null) {
    if (this && this.url != null) {
      parentURL = this.url;
    } else {
      parentURL = parseErrorStack(new Error().stack)?.[1].url;
    }
  }
  const port = getPort();
  Atomics.store(cache.lock, 0, 0);
  port.postMessage([specifier, parentURL]);
  Atomics.wait(cache.lock, 0, 0);
  const pair = worker_threads.receiveMessageOnPort(port).message;
  const [returnValue, error] = pair;
  if (pair.length === 2) {
    throw error;
  } else {
    return returnValue;
  }
}

/**
 * @param {ImportMeta} importMeta
 * @returns {ImportMeta}
 */
function applyResolvePolyfill(importMeta) {
  if (!importMeta.resolve || importMeta.resolve("data:,").then) {
    importMeta.resolve = resolve;
  }
  return importMeta;
}

export default applyResolvePolyfill;
