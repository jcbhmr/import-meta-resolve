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
          let r;
          try {
            r = [importMeta.resolve(specifier, parentURL)];
          } catch (e) {
            r = [, e];
          }
          worker_threads.workerData.port.postMessage(r);
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

// https://github.com/stacktracejs/stacktrace.js/blob/master/dist/stacktrace.js#L52
function getParentURLUsingErrorStack() {
  const { stack } = new Error();
  var filtered = stack.split("\n").filter(function (line) {
    return !!line.match(/^\s*at .*(\S+:\d+|\(native\))/m);
  }, this);

  const extractLocation = (urlLike) => {
    // Fail-fast but return locations like "(native)"
    if (urlLike.indexOf(":") === -1) {
      return [urlLike];
    }

    var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
    var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
    return [parts[1], parts[2] || undefined, parts[3] || undefined];
  };

  const frames = filtered.map(function (line) {
    if (line.indexOf("(eval ") > -1) {
      // Throw away eval information until we implement stacktrace.js/stackframe#8
      line = line
        .replace(/eval code/g, "eval")
        .replace(/(\(eval at [^()]*)|(\),.*$)/g, "");
    }
    var sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(");

    // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
    // case it has spaces in it, as the string is split on \s+ later on
    var location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

    // remove the parenthesized location from the line, if it was matched
    sanitizedLine = location
      ? sanitizedLine.replace(location[0], "")
      : sanitizedLine;

    var tokens = sanitizedLine.split(/\s+/).slice(1);
    // if a location was matched, pass it to extractLocation() otherwise pop the last token
    var locationParts = extractLocation(location ? location[1] : tokens.pop());
    var functionName = tokens.join(" ") || undefined;
    var fileName =
      ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1
        ? undefined
        : locationParts[0];

    return {
      functionName: functionName,
      fileName: fileName,
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line,
    };
  }, this);

  return frames[2].fileName;
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
      parentURL = getParentURLUsingErrorStack();
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
 * @param {ImportMeta} [importMeta]
 * @returns {ImportMeta}
 */
function applyResolvePolyfill(importMeta = {}) {
  if (!importMeta.resolve || importMeta.resolve("data:,").then) {
    importMeta.resolve = resolve;
  }
  return importMeta;
}

export default applyResolvePolyfill;
