"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lanucher_1 = require("./lib/lanucher");
// import { camelCase } from "lodash";
const camelCase = require("lodash/camelCase");
lanucher_1.default(async (argv0, argv1, command, ...options) => {
    const mode = options.includes("--http") ? 'http' : 'cli';
    const modeExecutor = require('./lib/executor')[mode];
    const commandFunc = require('./lib/command')[camelCase(command)];
    commandFunc(modeExecutor, options);
});
//# sourceMappingURL=index.js.map