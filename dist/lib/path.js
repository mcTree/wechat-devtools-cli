"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPath = void 0;
let Path = null;
exports.setPath = (flag) => {
    console.log(flag);
    Path = require('path')[flag];
};
exports.default = Path;
//# sourceMappingURL=path.js.map