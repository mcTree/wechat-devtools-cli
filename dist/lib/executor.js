"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutorFac = void 0;
const utils_js_1 = require("./utils.js");
const axios_1 = require("axios");
const utils_1 = require("./utils");
const chalk = require('chalk');
const execa = require("execa");
exports.ExecutorFac = (name, argv1, Path) => {
    let result;
    cli: {
        if (name !== 'cli')
            break cli;
        const cli = async (...options) => {
            const devtools = await utils_js_1.getDevtoolsDir(argv1);
            const command = `${devtools}\\cli.bat`;
            console.log(command);
            console.log(chalk.blue('实际命令:'), chalk.green(command), ...options);
            return execa(command, options);
        };
        result = cli;
        break cli;
    }
    http: {
        if (name !== 'http')
            break http;
        const http = async (command, ...options) => {
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
        result = http;
        break http;
    }
    return result;
};
//# sourceMappingURL=executor.js.map