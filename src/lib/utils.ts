const fs = require("fs-extra");
const execa = require("execa");
const chalk =require("chalk")

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

export const getProjectDir = (argv1 = process.argv[1], Path = require('path')) => {
  console.log(chalk.green(Path.sep))
  const configFileName = "project.config.json";
  const pathList = argv1.split(Path.sep);
  console.log(pathList)
  for (;;) {
    pathList.pop();
    if (pathList.length === 1) break;
    const temp = pathList.join(Path.sep) + Path.sep;
    const hasConf = fs.readdirSync(temp).includes(configFileName);
    if (hasConf) {
      const confStr = fs
        .readFileSync(Path.join(temp, configFileName))
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

export const getMiniprogramRoot = (argv1 = process.argv[1], Path) => {
  if (miniprogramRootCache !== "") return miniprogramRootCache;
  getProjectDir(argv1, Path);
  return miniprogramRootCache;
};

export const getDevtoolsDir = async (argv1 = process.argv[1]) => {
  const Path = require('path').win32
  const { stdout } = await execa.command(
    "powershell.exe reg query HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\微信开发者工具 /v UninstallString"
  );
  const temp = stdout.trimLeft().trimRight().split("  ");
  const uninstall = temp[temp.length - 1];
  console.log(chalk(Path.sep))
  const devtools = Path.dirname(uninstall);

  console.log(
    chalk.yellow(uninstall),
    chalk.red(devtools)
  )
  return Promise.resolve(devtools);
};


