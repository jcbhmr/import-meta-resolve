import getPort from "./getPort.js";
import { receiveMessageOnPort } from "node:worker_threads";

/**
 * @param {string} specifier
 * @param {string | URL} [parentURL]
 * @returns {string}
 * @this {ImportMeta}
 */
export default function resolve(specifier, parentURL = undefined) {
  if (
    this.resolve &&
    this.resolve !== resolve &&
    !this.resolve("data:,").then
  ) {
    // @ts-ignore
    return this.resolve(specifier, parentURL);
  }
  specifier = `${specifier}`;
  if (parentURL === undefined) {
    parentURL = this.url;
  }
  parentURL = `${parentURL}`;

  const port = getPort();

  const lockBuffer = new SharedArrayBuffer(4);
  const lock = new Int32Array(lockBuffer);
  port.postMessage([lockBuffer, specifier, parentURL]);
  Atomics.wait(lock, 0, 0);
  // @ts-ignore
  const r = receiveMessageOnPort(port).message;

  if (r.length == 1) {
    return r[0];
  } else {
    throw r[1];
  }
}
