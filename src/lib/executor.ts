import { getDevtoolsDir } from "./utils.js";
import axios from "axios";
import { getPort } from "./utils";

const execa = require("execa");

export const cli:ModeExecutor = async (...options) => {
  const devtools = await getDevtoolsDir();
  const command = `${devtools}\\cli.bat`;
  console.log('实际命令:', command, ...options)
  return execa(command, options);
};

export const http = async (command, ...options)=>{
  // http://127.0.0.1:端口号/v2/command/options
  // 项目目录指的是有project.config.json的目录
  // 准备加上监听node_modules 目录/ package.json文件 来进行更新和编译
  const params = new URLSearchParams(options);
  const url = `http://127.0.0.1:${getPort()}/v2/${command}/?${params.toString()}`;
  try{
    const res = await axios.get(url)
    return Promise.resolve(res)
  }catch(e) {
    console.error(e.errno, e.respones);
  };
}
