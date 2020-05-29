// const execa = require("execa");
// const path = require("path");
const fs = require("fs-extra");

const getPort = async function () {
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

module.exports = {
  getPort
}
