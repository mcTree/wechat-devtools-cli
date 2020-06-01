import { getDevtoolsDir } from "./utils.js";
import axios from "axios";
import { getPort } from "./utils";
const chalk = require('chalk')

const execa = require("execa");

export const ExecutorFac = (name, argv1, Path): ModeExecutor => {
  let result;
  cli: {
    if(name!=='cli')break cli;
    const cli: ModeExecutor = async (...options) => {
      const devtools = await getDevtoolsDir(argv1)
      const command = `${devtools}\\cli.bat`;
      console.log(command)
      console.log(chalk.blue('实际命令:'), chalk.green(command), ...options)
      return execa(command, options);
    };
    result = cli;
    break cli;
  }
  http: {
    if(name!=='http')break http;
    const http = async (command, ...options) => {
      // http://127.0.0.1:端口号/v2/command/options
      // 项目目录指的是有project.config.json的目录
      // 准备加上监听node_modules 目录/ package.json文件 来进行更新和编译
      const params = new URLSearchParams(options);
      const url = `http://127.0.0.1:${getPort()}/v2/${command}/?${params.toString()}`;
      try {
        const res = await axios.get(url)
        return Promise.resolve(res)
      } catch (e) {
        console.error(e.errno, e.respones);
      };
    }

    result = http;
    break http;
  }
  return result;
}
