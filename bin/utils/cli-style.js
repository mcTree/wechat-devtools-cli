const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");

let miniprogramRootCache = "";

const getProject = (argv1) => {
  const configFileName = "project.config.json";
  const pathList = argv1.split(path.sep);
  for (;;) {
    if (pathList.length === 1) break;
    const temp = pathList.join(path.sep) + path.sep;
    const hasCofig = fs.readdirSync(temp).includes(configFileName);
    if (hasCofig) {
      const confStr = fs
        .readFileSync(path.join(temp, configFileName))
        .toString();
      const confObj = JSON.parse(confStr);
      if (typeof confObj.appid === "string" && confObj.appid !== "") {
        miniprogramRootCache = confObj.miniprogramRoot;
        return temp;
      }
    }
    pathList.pop();
  }
  throw new Error("Not Find Project Dir");
};

const getMiniprogramRoot = () => {
  if (miniprogramRootCache !== "") return miniprogramRootCache;
  getProject();
  return miniprogramRootCache;
};

const getDevtools = async () => {
  const { stdout } = await execa.command(
    "powershell reg query HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\微信开发者工具 /v UninstallString"
  );
  const temp = stdout.trimLeft().trimRight().split("  ");
  const uninstall = temp[temp.length - 1];
  const devtools = path.dirname(uninstall);
  return Promise.resolve(devtools);
};

const cli = async (command, ...options) => {
  const devtools = await getDevtools();
  const cliPath = `${devtools}\\cli`;
  return execa(command, options);
};

const actions = {
  open: async (/* options */) => {
    // http://127.0.0.1:端口号/v2/open?project=项目全路径
    // cli open
    return cli("open", "--project", getProject());
  },
  "build-npm": async (options) => {
    const projectPath = getProject();
    const miniprogramRoot = getMiniprogramRoot();
    /**
     * --watch 监听
     * --project / --package 监听 package.json @default
     * --lib / --modules 监听 node_modules
     */
    if (options.includes("--watch")) {
      let watchPath = "";
      const isLib = (options.includes("--modules") || options.includes("--lib"))
      if (isLib) {
        watchPath = path.join(projectPath, miniprogramRoot, "node_modules");
      } else {
        watchPath = path.resolve(projectPath, miniprogramRoot, "package.json");
      }

      return new Promise((resolve, reject) => {
        try {
          chokidar.watch(watchPath).on("all", (event, path) => {
            cli("build-npm", "--project", getProject());
            resolve({ event, path });
          });
        } catch (e) {
          reject(e);
        }
      });
    }

    return cli("build-npm", "--project", getProject());
  },
};

const devtools = (command, options) => {
  actions[command](options);
};

module.exports = {
  devtools,
};
