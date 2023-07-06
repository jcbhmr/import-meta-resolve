import resolve_ from "./lib/resolve.js";

/**
 * @param {ImportMeta} importMeta
 * @param {string} specifier
 * @param {string | URL} [parentURL]
 * @returns {string}
 */
export default Object.call.bind(resolve_);
