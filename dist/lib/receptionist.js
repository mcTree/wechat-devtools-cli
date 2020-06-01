"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchTarget = exports.getRunMode = exports.getExecuterMode = exports.getSysFlag = void 0;
exports.getSysFlag = (options) => {
    if (options.includes('--posix')) {
        return 'posix';
    }
    if (options.includes('--win32')) {
        return 'win32';
    }
    return false;
};
exports.getExecuterMode = (options) => options.includes("--http") ? 'http' : 'cli';
exports.getRunMode = (options) => options.includes("--watch") ? 'watch' : 'normal';
exports.getWatchTarget = (options) => 
// options.includes("--package-conf")
options.includes("--modules-file") ? 'node_modules' : 'package.json';
//# sourceMappingURL=receptionist.js.map