![🚧 Under construction 👷‍♂️](https://i.imgur.com/LEP2R3N.png)

# Node.js v20 `import.meta.resolve()` polyfill

🎯 import.meta.resolve() backport for Node.js

<div align="center">

![]()

</div>

⏱ Completely synchronous, just like in the browser \
🧙‍♂️ Automagically deduces the `import.meta.url` \
🔃 Works with `--loader` stuff too! \
🌳 Don't need to `--experimental-import-meta-resolve`

## Installation

```sh
npm install @jcbhmr/node-import-meta-resolve
```

🛑 This package is designed to work **only** with Node.js. Other platforms are
not supported. If you're using Deno or the browser, you probably **already have
a native `import.meta.resolve()`** function! 😊

## Usage

```js
import applyResolvePolyfill from "@jcbhmr/node-import-meta-resolve";
applyResolvePolyfill(import.meta);

console.log(import.meta.resolve("is-odd"))
//=> file:///node_modules/is-odd/index.js
console.log(import.meta.resolve("./index.js"))
//=> file:///index.js
console.log(import.meta.resolve("./index.js", "./test/hello.js");
//=> file:///test/index.js
```

## How it works

We use Node.js' fancy ability to set `--cli-args` **for worker threads**. That
means we can use the native implementation of `import.meta.resolve()` (available
in all Node.js LTS versions) to resolve the arguments on a worker thread. The
tricky part is, of course, getting the result back to the main thread
synchronously. 😉

## Development

This is a really simple package. It's simple enough that we can get away without
using TypeScript and instead rely on JSDoc comments for type information. To get
started, run `npm install` and then `npm test` to run the test suite.

```sh
npm install
npm test
```

The most complicated part of this package is managing the worker thread to make
sure that:

1. It's alive _only when it's needed_. That means we need to kill it if it's not
   in use for N seconds.
2. We don't accidentally keep the thread alive via `.ref()` (the default on
   creation). We need to remember to explicitly `.unref()` everything.
3. We run the RPC to resolve the arguments _syncronously_. This means we need to
   do some fancy `SharedArrayBuffer` signalling to make sure that the main
   thread waits for the worker thread to finish.
