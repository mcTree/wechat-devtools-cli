const fs = require("fs-extra");
const execa = require("execa");
const path = require('path')

export const getPort = async  ()=> {
  // ~/AppData/Local/微信开发者工具/User Data/Default/.ide
  const configFilePath = `${process.env.USERPROFILE}/AppData/Local/微信开发者工具/User Data`;
  const dirs = await fs.readdir(configFilePath);
  if (dirs.includes("Default")) {
    const result = await fs.readFile(`${configFilePath}/Default/.ide`);
    return Promise.resolve(result.toString());
  } else {
    for (const dir of dirs) {
      if (dir !== "Crashpad") {
        const result = await fs.readFile(
          `${configFilePath}/${dir}/Default/.ide`
        );
        return Promise.resolve(result.toString());
      }
    }
  }
  return Promise.reject({
    code: 404,
    msg: "没找到文件",
  });
};

let miniprogramRootCache = "";

export const getProjectDir = (argv1 = process.argv[1]) => {
  const configFileName = "project.config.json";
  const pathList = argv1.split(path.sep);
  for (;;) {
    pathList.pop();
    if (pathList.length === 1) break;
    const temp = pathList.join(path.sep) + path.sep;
    const hasConf = fs.readdirSync(temp).includes(configFileName);
    if (hasConf) {
      const confStr = fs
        .readFileSync(path.join(temp, configFileName))
        .toString();
      const confObj = JSON.parse(confStr);
      if (typeof confObj.appid === "string" && confObj.appid !== "") {
        miniprogramRootCache = confObj.miniprogramRoot;
        return temp;
      }
    }
  }
  throw new Error("Not Find Project Dir");
};

export const getMiniprogramRoot = () => {
  if (miniprogramRootCache !== "") return miniprogramRootCache;
  getProjectDir();
  return miniprogramRootCache;
};

export const getDevtoolsDir = async () => {
  const { stdout } = await execa.command(
    "powershell reg query HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\微信开发者工具 /v UninstallString"
  );
  const temp = stdout.trimLeft().trimRight().split("  ");
  const uninstall = temp[temp.length - 1];
  const devtools = path.dirname(uninstall);
  return Promise.resolve(devtools);
};


