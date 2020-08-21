"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prop = void 0;
const array_1 = require("./array");
exports.prop = (f, p, ...sources) => (n) => array_1.cartesian(sources.map(s => s(n))).map(args => {
    const result = f(...args);
    return { depth: n, input: args, result, ok: p(result, ...args) };
});
