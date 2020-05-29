import Lanucher from "./lib/lanucher";
import camelCase from "lodash/camelCase"

Lanucher(
  async (
    argv0: string,
    argv1: string,
    command: Command,
    ...options: [LanucherOption]
  ) => {
    let mode:Mode = options.includes("--http")?'http':'cli';
    const modeExecutor:ModeExecutor = require('./lib/executor')[mode];
    const commandFunc:CommandFunc =require('./lib/command')[camelCase(command)]
    commandFunc(modeExecutor, options);
  }
);
