"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneof = exports.tuple = exports.array = exports.string = exports.char = exports.number = exports.float = exports.bigint = exports.int = exports.nat = exports.boolean = exports.always = exports.map = exports.scale = exports.shift = exports.mapDepth = void 0;
const array_1 = require("./array");
exports.mapDepth = (f, s) => n => s(f(n));
exports.shift = (n, s) => exports.mapDepth(n0 => Math.max(0, n0 + n), s);
exports.scale = (n, s) => exports.mapDepth(n0 => Math.max(0, Math.trunc(n0 * n)), s);
exports.map = (s, f) => n => s(n).map(f);
// Basic Sources
exports.always = (a) => _ => [a];
exports.boolean = n => n === 0 ? [false] : n === 1 ? [true] : [];
exports.nat = n => [n];
exports.int = n => [-n, n];
exports.bigint = exports.map(exports.int, BigInt);
exports.float = n => n === 0 ? [-0, 0] : n === 1 ? [-1, 1] : withNegatives(2 ** (n - 1));
exports.number = n => n === 0 ? [NaN, -Infinity, Infinity, -0, 0] : n === 1 ? [-1, 1] : withNegatives(2 ** (n - 1));
const withNegatives = (x, y = 1 / x) => [-x, -y, x, y];
exports.char = (chars) => 
// n => n < chars.length ? [chars.charAt(n)] : []
n => chars.slice(0, n + 1).split('');
exports.string = (s) => exports.map(exports.array(s), chars => chars.join(''));
// Products
exports.array = (s) => n => n === 0 ? [[]] : array_1.cartesian(Array(n).fill(n - 1).map(s));
exports.tuple = (...sources) => n => n === 0 ? [[]] : array_1.cartesian(sources.map(s => s(n - 1)));
exports.oneof = (...sources) => n => sources.flatMap(s => s(n));
