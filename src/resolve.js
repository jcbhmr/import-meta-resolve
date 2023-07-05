import callsites from "callsites";
import url from "node:url";
import getWorker from "./lib/getWorker.js";
import receiveMessageOnWorker from "./lib/recieveMessageOnWorker.js";

/**
 * @param {string} specifier
 * @param {string | URL} [parentURL]
 * @returns {string}
 * @this {ImportMeta | void}
 */
export default function resolve(specifier, parentURL = undefined) {
  specifier = `${specifier}`;
  if (parentURL === undefined) {
    parentURL =
      // @ts-ignore
      this?.url ?? url.pathToFileURL(callsites()[1].getFileName()).href;
  } else {
    parentURL = `${parentURL}`;
  }

  // @ts-ignore
  if (import.meta.resolve && !import.meta.resolve("data:,").then) {
    // @ts-ignore
    return import.meta.resolve(specifier, parentURL);
  }

  const worker = getWorker();

  const lockBuffer = new SharedArrayBuffer(4);
  const lock = new Int32Array(lockBuffer);
  worker.postMessage([lockBuffer, specifier, parentURL]);
  Atomics.wait(lock, 0, 1);
  const r = receiveMessageOnWorker(worker).message;

  if (r.length == 1) {
    return r[0];
  } else {
    throw r[1];
  }
}
