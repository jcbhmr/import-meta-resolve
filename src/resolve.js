import callsites from "callsites";
import url from "node:url";
import getPort from "./lib/getPort.js";
import worker_threads from "node:worker_threads";

/**
 * @param {string} specifier
 * @param {string | URL} [parentURL]
 * @returns {string}
 * @this {ImportMeta | void}
 */
export default function resolve(specifier, parentURL = undefined) {
  specifier = `${specifier}`;
  if (parentURL === undefined) {
    // @ts-ignore
    if (this?.url != null) {
      // @ts-ignore
      parentURL = this.url;
    } else {
      const fileName = callsites()[1].getFileName();
      if (fileName.startsWith("file:")) {
        parentURL = fileName;
      } else {
        parentURL = url.pathToFileURL(fileName).href;
      }
    }
  } else {
    parentURL = `${parentURL}`;
  }

  // @ts-ignore
  if (import.meta.resolve && !import.meta.resolve("data:,").then) {
    // @ts-ignore
    return import.meta.resolve(specifier, parentURL);
  }

  const port = getPort();

  const lockBuffer = new SharedArrayBuffer(4);
  const lock = new Int32Array(lockBuffer);
  port.postMessage([lockBuffer, specifier, parentURL]);
  Atomics.wait(lock, 0, 0);
  // @ts-ignore
  const r = worker_threads.receiveMessageOnPort(port).message;

  if (r.length == 1) {
    return r[0];
  } else {
    throw r[1];
  }
}
