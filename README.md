![🚧 Under construction 👷‍♂️](https://i.imgur.com/LEP2R3N.png)

# `import.meta.resolve()` polyfill

🎯 Standard synchronous `import.meta.resolve()` for anywhere \
💡 Inspired by [wooorm/import-meta-resolve]

<div align="center">

TODO: Add header image here

</div>

⏱ Completely synchronous, just like in the browser \
🧙 Automagically deduces the `import.meta.url` \
🔃 Works with `--loader` stuff too! \
🌳 Don't need to `--experimental-import-meta-resolve` \
🦄 Importable as a ponyfill or polyfill

## Installation

![npm](https://img.shields.io/static/v1?style=for-the-badge&message=npm&color=CB3837&logo=npm&logoColor=FFFFFF&label=)
![Yarn](https://img.shields.io/static/v1?style=for-the-badge&message=Yarn&color=2C8EBB&logo=Yarn&logoColor=FFFFFF&label=)
![pnpm](https://img.shields.io/static/v1?style=for-the-badge&message=pnpm&color=222222&logo=pnpm&logoColor=F69220&label=)

You can install this package from npm using npm, [Yarn], [pnpm], or your other
favorite npm package manager. 😎

```sh
npm install @jcbhmr/node-import-meta-resolve
```

🛑 This package is designed to work **only** with Node.js. Other platforms are
not supported. If you're using Deno or the browser, you probably **already have
a native `import.meta.resolve()`** function! 😊

## Usage

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=339933&logo=Node.js&logoColor=FFFFFF&label=)

⚠️ The two-argument `import.meta.resolve(specifier, parentURL)` is only
supported on Node.js and Bun! This behaviour **cannot** be replicated elsewhere
like in Deno or the browser right now. If you want this, make sure to upvote and
participate in the discussion over at [whatwg/html#8077] to get some kind of ESM
resolver that accepts a parent/base URL.

```js
import polyfill from "@jcbhmr/node-import-meta-resolve/polyfill.js";
import resolve from "@jcbhmr/node-import-meta-resolve/resolve.js";
polyfill(import.meta);

console.log(import.meta.resolve("is-odd"));
//=> file:///node_modules/is-odd/index.js
console.log(import.meta.resolve("./index.js"));
//=> file:///index.js
```

[yarn]: https://yarnpkg.com/
[pnpm]: https://pnpm.io/
[wooorm/import-meta-resolve]: https://github.com/wooorm/import-meta-resolve
[whatwg/html#8077]: https://github.com/whatwg/html/issues/8077
