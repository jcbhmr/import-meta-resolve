import worker_threads from "node:worker_threads";

/**
 * @param {import("node:worker_threads").Worker} worker
 * @returns {{ message: any } | undefined}
 */
export default function receiveMessageOnWorker(worker) {
  const publicPortSymbol = Object.getOwnPropertySymbols(worker).find(
    (s) => s.description === "kPublicPort"
  );
  if (!publicPortSymbol) {
    throw new ReferenceError(`${worker} does not have kPublicPort symbol`);
  }
  console.debug("worker port", worker[publicPortSymbol]);
  return worker_threads.receiveMessageOnPort(worker[publicPortSymbol]);
}
