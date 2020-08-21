"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartesian = void 0;
// Cartesian product helper
exports.cartesian = (args) => {
    const r = [];
    function helper(max, r, arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
            const a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i === max)
                r.push(a);
            else
                helper(max, r, a, i + 1);
        }
    }
    helper(args.length - 1, r, [], 0);
    return r;
};
