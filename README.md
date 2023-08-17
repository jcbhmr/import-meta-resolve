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

If you want to use this package in the browser (🎗️ [`import.meta.resolve()` is
well supported in browsers]) you can import it directly from an npm CDN like
[esm.sh] or [jsDelivr].

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

```js
import resolve from "@webfill/import-meta-resolve";

console.log(resolve(import.meta, "is-odd"));
//=> file:///awesome-project/node_modules/is-odd/index.js
// OR using import maps in a browser:
//=> https://esm.run/is-odd

console.log(resolve(import.meta, "./lib.js"));
//=> file:///awesome-project/lib.js
// OR when in a browser:
//=> https://localhost:8080/lib.js
```

```js
import polyfill from "@webfill/import-meta-resolve/polyfill.js";
polyfill(import.meta);

console.log(import.meta.resolve("is-odd"));
//=> file:///awesome-project/node_modules/is-odd/index.js
// OR using import maps in a browser:
//=> https://esm.run/is-odd

console.log(import.meta.resolve("./lib.js"));
//=> file:///awesome-project/lib.js
// OR when in a browser:
//=> https://localhost:8080/lib.js
```

⚠️ The two-argument `import.meta.resolve(specifier, parentURL)` is only
supported on Node.js and Bun! This behaviour **cannot** be replicated (easily)
elsewhere like in Deno or the browser right now. Check out [whatwg/html#8077] if
you're interested in the standardization discussion.

```js
import polyfill from "@webfill/import-meta-resolve/polyfill.js";
polyfill(import.meta);

console.log(import.meta.resolve("is-odd"));
//=> file:///awesome-project/node_modules/is-odd/index.js

console.log(import.meta.resolve("is-odd", "file:///different-project/app.js"));
//=> file:///different-project/node_modules/is-odd/index.js
```

<!-- prettier-ignore-start -->
[yarn]: https://yarnpkg.com/
[pnpm]: https://pnpm.io/
[wooorm/import-meta-resolve]: https://github.com/wooorm/import-meta-resolve
[whatwg/html#8077]: https://github.com/whatwg/html/issues/8077
[esm.sh]: https://esm.sh/
[jsdelivr]: https://www.jsdelivr.com/esm
[`import.meta.resolve()` is well supported in browsers]: https://caniuse.com/mdn-javascript_operators_import_meta_resolve
<!-- prettier-ignore-end -->
