import { getProjectDir, getMiniprogramRoot, getDevtoolsDir } from "./utils";
import chokidar from "chokidar"
export const open: CommandFunc = async (execute: ModeExecutor, store) => {
  // http://127.0.0.1:端口号/v2/open?project=项目全路径
  // cli open
  const argv1 = store.get('argv1')
  const Path = store.get('Path')
  const projectDir = getProjectDir(argv1, Path)
  return execute("open", "--project", projectDir);
}

export const buildNpm: CommandFunc = async (executor: ModeExecutor,store) => {
  const projectDir = getProjectDir(store.get('argv1'), store.get('Path'))
  const cliParams: [Command, string, string] = ["build-npm", "--project", projectDir]
  /**
   * --watch 监听
   * --project / --package 监听 package.json @default
   * --lib / --modules 监听 node_modules
   */
  if (store.get('run-mode')==='watch') {
    const miniprogramRoot = getMiniprogramRoot(store.get('argv1'), store.get('Path'));
    let watchPath = "";
    watchPath = store.get('Path').resolve(projectDir, miniprogramRoot, store.get('watch-target'));
    return new Promise((resolve, reject) => {
      try {
        chokidar.watch(watchPath).on("all", (event, dir) => {
          executor(...cliParams)
          resolve({ event, dir });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  return executor(...cliParams)
}