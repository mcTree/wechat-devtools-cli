const axios = require("axios");
const path = require("path");
const { URLSearchParams } = require("url");
const chokidar = require("chokidar");
const { project, getPort } =require('./cli-style')

const buildnpm = async (port, num = 0) => {
  if (num >= 1) return;
  // http://127.0.0.1:端口号/v2
  // 项目目录指的是有project.config.json的目录
  // 准备加上监听node_modules 目录/ package.json文件 来进行更新和编译
  const params = new URLSearchParams({ project });
  const url = `http://127.0.0.1:${port}/v2/buildnpm/?${params.toString()}`;
  try{
    const res = await axios.get(url)
    return Promise.resolve(res)
  }catch(e) {
    console.log(e.errno, e.respones);
    
    if (e.code === "ECONNREFUSED") {
      return Promise.reject({msg:'Err: 未打开开发者工具\n> npm run open:devtools \n或\n> yarn run open:devtools'})
    }
  };
};

const modeVali = () => {
  const { argv } = process;
  let r = {
    mode: "once",
    flag: "project",
  };
  if (argv.includes("--watch")) {
    const flag = argv[argv.indexOf("--watch") + 1];
    r.mode = "watch";
    r.flag = flag ? flag : r.flag;
  }
  return r;
};

const main = async () => {
  const port = await getPort();
  const args = modeVali();
  if (args.mode === "watch") {
    let watchPath = "";
    let mode = 'all'
    switch (args.flag) {
      case "lib":
        mode="all"
        watchPath = path.resolve(__dirname, "../miniprogram/node_modules");
        break;
      case "project":
        mode="change"
        watchPath = path.resolve(__dirname, "../miniprogram/package.json");
        break;
      default:
        throw new Error();
    }
    chokidar.watch(watchPath).on("all", (event, path) => {
      console.log(event, path);
      buildnpm(port).catch((e) => {
        console.error(e.msg);
      });
    });
  } else {
    buildnpm(port).then(r=>{
      console.log('success')
    }).catch(e=>{
      console.error(e.msg);
    });
  }
};

main();
