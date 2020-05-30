"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = exports.cli = void 0;
const utils_js_1 = require("./utils.js");
const axios_1 = require("axios");
const utils_1 = require("./utils");
const execa = require("execa");
exports.cli = async (...options) => {
    const devtools = await utils_js_1.getDevtoolsDir();
    const command = `${devtools}\\cli.bat`;
    console.log('实际命令:', command, ...options);
    return execa(command, options);
};
exports.http = async (command, ...options) => {
    // http://127.0.0.1:端口号/v2/command/options
    // 项目目录指的是有project.config.json的目录
    // 准备加上监听node_modules 目录/ package.json文件 来进行更新和编译
    const params = new URLSearchParams(options);
    const url = `http://127.0.0.1:${utils_1.getPort()}/v2/${command}/?${params.toString()}`;
    try {
        const res = await axios_1.default.get(url);
        return Promise.resolve(res);
    }
    catch (e) {
        console.error(e.errno, e.respones);
    }
    ;
};
//# sourceMappingURL=executor.js.map