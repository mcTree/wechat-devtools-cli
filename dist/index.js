"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lanucher_1 = require("./lib/lanucher");
const store_1 = require("./store");
const executor_1 = require("./lib/executor");
const receptionist_1 = require("./lib/receptionist");
const Path = require('path');
const camelCase = require("lodash/camelCase");
const d = () => {
    return lanucher_1.default(async (argv0, argv1, command, ...options) => {
        const sys = receptionist_1.getSysFlag(options);
        store_1.default.set('sys', sys);
        // store.set( 'Path', sys?Path[sys]:Path);
        store_1.default.set('Path', Path);
        store_1.default.set('argv0', argv0);
        store_1.default.set('argv1', argv1);
        store_1.default.set('run-mode', receptionist_1.getRunMode(options));
        store_1.default.set('watch-target', receptionist_1.getWatchTarget(options));
        const mode = receptionist_1.getExecuterMode(options);
        const modeExecutor = executor_1.ExecutorFac(mode, argv1, store_1.default.get("Path"));
        const commandFunc = require('./lib/command')[camelCase(command)];
        commandFunc(modeExecutor, store_1.default);
    });
};
module.exports = d;
//# sourceMappingURL=index.js.map