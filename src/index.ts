import Lanucher from "./lib/lanucher";
import store from "./store";
import {ExecutorFac} from './lib/executor'
import { getSysFlag, getExecuterMode, getRunMode, getWatchTarget } from "./lib/receptionist";
const Path =require('path')
const camelCase = require("lodash/camelCase")

const d = ()=>{
  return Lanucher(
    async (
      argv0: string,
      argv1: string,
      command: Command,
      ...options: [LanucherOption]
    ) => {
      const sys = getSysFlag(options);
      store.set( 'sys',sys);
      // store.set( 'Path', sys?Path[sys]:Path);
      store.set( 'Path', Path);
      store.set( 'argv0', argv0);
      store.set( 'argv1', argv1)
      store.set( 'run-mode', getRunMode(options));
      store.set( 'watch-target', getWatchTarget(options));
      const mode:ExecuterMode = getExecuterMode(options);
      const modeExecutor:ModeExecutor = ExecutorFac(mode,argv1,store.get("Path"));
      const commandFunc:CommandFunc =require('./lib/command')[camelCase(command)]
      commandFunc(modeExecutor, store);
    }
  );
}

module.exports=d
