"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.show = exports.enumerate = exports.assert = exports.defaultTestConfig = void 0;
exports.defaultTestConfig = {
    minDepth: parseInt((_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SMALLS_MIN_DEPTH) !== null && _b !== void 0 ? _b : '') || 0,
    maxDepth: parseInt((_d = (_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.SMALLS_MAX_DEPTH) !== null && _d !== void 0 ? _d : '') || 4,
    maxExamples: parseInt((_f = (_e = process === null || process === void 0 ? void 0 : process.env) === null || _e === void 0 ? void 0 : _e.SMALLS_MAX_EXAMPLES) !== null && _f !== void 0 ? _f : '', 10) || 100,
    evaluateResult: (r, i) => {
        if (!r.ok)
            throw new Error(`Counterexample (tries: ${i + 1}, depth: ${r.depth})
      ${JSON.stringify(r.input)} -> result: ${JSON.stringify(r.result)}`);
    }
};
exports.assert = (p, { maxExamples, minDepth: startDepth, maxDepth, evaluateResult } = exports.defaultTestConfig) => {
    let n = startDepth, examples = 0;
    while (examples < maxExamples && n < maxDepth) {
        const rs = p(n);
        rs.forEach((r, i) => evaluateResult(r, examples + i));
        examples += rs.length;
        n += 1;
    }
};
exports.enumerate = (s, { maxExamples, minDepth: startDepth, maxDepth, evaluateResult } = exports.defaultTestConfig) => {
    const results = [];
    let n = startDepth;
    while (results.length < maxExamples && n < maxDepth) {
        results.push(...s(n));
        n += 1;
    }
    return results;
};
exports.show = (s, config = exports.defaultTestConfig) => exports.enumerate(s, config).map(s => `(${s})`).join(', ');
