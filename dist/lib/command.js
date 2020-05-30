"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNpm = exports.open = void 0;
const utils_1 = require("./utils");
const chokidar_1 = require("chokidar");
const Path = require("path");
exports.open = async (execute) => {
    // http://127.0.0.1:端口号/v2/open?project=项目全路径
    // cli open
    return execute("open", "--project", utils_1.getProjectDir());
};
exports.buildNpm = async (executor, options) => {
    const projectDir = utils_1.getProjectDir();
    const cliParams = ["build-npm", "--project", projectDir];
    /**
     * --watch 监听
     * --project / --package 监听 package.json @default
     * --lib / --modules 监听 node_modules
     */
    if (options.includes("--watch")) {
        const miniprogramRoot = utils_1.getMiniprogramRoot();
        let watchPath = "";
        const isLib = options.includes("--modules") || options.includes("--lib");
        if (isLib) {
            watchPath = Path.join(projectDir, miniprogramRoot, "node_modules");
        }
        else {
            watchPath = Path.resolve(projectDir, miniprogramRoot, "package.json");
        }
        return new Promise((resolve, reject) => {
            try {
                chokidar_1.default.watch(watchPath).on("all", (event, dir) => {
                    executor(...cliParams);
                    resolve({ event, dir });
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    return executor(...cliParams);
};
//# sourceMappingURL=command.js.map