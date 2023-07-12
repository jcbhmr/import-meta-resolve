# `import.meta.resolve()` polyfill

🎯 Standard synchronous `import.meta.resolve()` for anywhere \
💡 Inspired by [wooorm/import-meta-resolve]

<div align="center">

![](https://i.imgur.com/9E9Mu1q.png)

</div>

⏱ Completely synchronous, just like in the browser \
🔃 Works with `--loader` stuff too! \
🌳 Don't need to `--experimental-import-meta-resolve` \
🦄 Importable as a ponyfill or polyfill \
🧅 Works in Node.js, Bun, Deno, and the browser too

## Installation

![npm](https://img.shields.io/static/v1?style=for-the-badge&message=npm&color=CB3837&logo=npm&logoColor=FFFFFF&label=)
![Yarn](https://img.shields.io/static/v1?style=for-the-badge&message=Yarn&color=2C8EBB&logo=Yarn&logoColor=FFFFFF&label=)
![pnpm](https://img.shields.io/static/v1?style=for-the-badge&message=pnpm&color=222222&logo=pnpm&logoColor=F69220&label=)
![jsDelivr](https://img.shields.io/static/v1?style=for-the-badge&message=jsDelivr&color=E84D3D&logo=jsDelivr&logoColor=FFFFFF&label=)

You can install this package from npm using npm, [Yarn], [pnpm], or your other
favorite npm package manager. 😎

```sh
npm install @webfill/import-meta-resolve
```

If you're using Deno, you can use the `npm:` specifier or a Deno-compatible npm
CDN like [esm.sh]

```js
import {} from "npm:@webfill/import-meta-resolve";
import {} from "https://esm.sh/@webfill/import-meta-resolve";
```

If you want to use this package in the browser (it's a no-op there, but you do
you!) you can import it directly from an npm CDN like [esm.sh] or [jsDelivr].

```js
import {} from "https://esm.sh/@webfill/import-meta-resolve";
import {} from "https://esm.run/@webfill/import-meta-resolve";
```

## Usage

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=339933&logo=Node.js&logoColor=FFFFFF&label=)
![Deno](https://img.shields.io/static/v1?style=for-the-badge&message=Deno&color=000000&logo=Deno&logoColor=FFFFFF&label=)
![Browser](https://img.shields.io/static/v1?style=for-the-badge&message=Browser&color=4285F4&logo=Google+Chrome&logoColor=FFFFFF&label=)
![Bun](https://img.shields.io/static/v1?style=for-the-badge&message=Bun&color=000000&logo=Bun&logoColor=FFFFFF&label=)

This package exists primarily to smooth over the different names, signatures,
and return values among Bun, Deno, Node.js, and the browser.

⚠️ The two-argument `import.meta.resolve(specifier, parentURL)` is only
supported on Node.js and Bun! This behaviour **cannot** be replicated (easily)
elsewhere like in Deno or the browser right now. If you want a standard, make
sure to upvote and participate in the discussion over at [whatwg/html#8077] to
get some kind of ESM resolver that accepts a parent/base URL.

```js
import resolve from "@webfill/import-meta-resolve";

console.log(resolve(import.meta, "is-odd"));
//=> file:///awesome-project/node_modules/is-odd/index.js

console.log(resolve(import.meta, "./lib.js"));
//=> file:///awesome-project/lib.js

// Node.js and Bun specific!
console.log(resolve(import.meta, "is-odd", "file:///awesome-project/lib.js"));
//=> file:///awesome-project/node_modules/is-odd/index.js
```

```js
import polyfill from "@webfill/import-meta-resolve/polyfill.js";
polyfill(import.meta);

console.log(import.meta.resolve("is-odd"));
//=> file:///awesome-project/node_modules/is-odd/index.js

console.log(import.meta.resolve("./lib.js"));
//=> file:///awesome-project/lib.js

// Node.js and Bun specific!
console.log(import.meta.resolve("is-odd", "file:///awesome-project/lib.js"));
//=> file:///awesome-project/node_modules/is-odd/index.js
```

[yarn]: https://yarnpkg.com/
[pnpm]: https://pnpm.io/
[wooorm/import-meta-resolve]: https://github.com/wooorm/import-meta-resolve
[whatwg/html#8077]: https://github.com/whatwg/html/issues/8077
[esm.sh]: https://esm.sh/
[jsdelivr]: https://www.jsdelivr.com/esm
