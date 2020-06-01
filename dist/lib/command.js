"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNpm = exports.open = void 0;
const utils_1 = require("./utils");
const chokidar_1 = require("chokidar");
exports.open = async (execute, store) => {
    // http://127.0.0.1:端口号/v2/open?project=项目全路径
    // cli open
    const argv1 = store.get('argv1');
    const Path = store.get('Path');
    const projectDir = utils_1.getProjectDir(argv1, Path);
    return execute("open", "--project", projectDir);
};
exports.buildNpm = async (executor, store) => {
    const projectDir = utils_1.getProjectDir(store.get('argv1'), store.get('Path'));
    const cliParams = ["build-npm", "--project", projectDir];
    /**
     * --watch 监听
     * --project / --package 监听 package.json @default
     * --lib / --modules 监听 node_modules
     */
    if (store.get('run-mode') === 'watch') {
        const miniprogramRoot = utils_1.getMiniprogramRoot(store.get('argv1'), store.get('Path'));
        let watchPath = "";
        watchPath = store.get('Path').resolve(projectDir, miniprogramRoot, store.get('watch-target'));
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