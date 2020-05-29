import { getProjectDir,getMiniprogramRoot } from "./utils";
import Path from "path";
import chokidar from "chokidar"


export const open:CommandFunc = async (execute:ModeExecutor) => {
  // http://127.0.0.1:端口号/v2/open?project=项目全路径
  // cli open
  return execute("open", "--project", getProjectDir());
}

export const buildNpm:CommandFunc = async (executor:ModeExecutor, options) => {
  const projectDir = getProjectDir();
  const cliParams:[Command,string,string] = ["build-npm", "--project", projectDir]
  /**
   * --watch 监听
   * --project / --package 监听 package.json @default
   * --lib / --modules 监听 node_modules
   */
  if (options.includes("--watch")) {
    const miniprogramRoot = getMiniprogramRoot();
    let watchPath = "";
    const isLib = options.includes("--modules") || options.includes("--lib");
    if (isLib) {
      watchPath = Path.join(projectDir, miniprogramRoot, "node_modules");
    } else {
      watchPath = Path.resolve(projectDir, miniprogramRoot, "package.json");
    }

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