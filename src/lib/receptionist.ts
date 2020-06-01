export const getSysFlag = (options:[LanucherOption])=>{
  if(options.includes('--posix')){
    return 'posix'
  }
  if(options.includes('--win32')){
    return 'win32'
  }
  return false
}

export const getExecuterMode =(
  options:[LanucherOption]
)=>
  options.includes("--http")?'http':'cli';

export const getRunMode = (
  options:[LanucherOption]
)=>
  options.includes("--watch")?'watch':'normal';

export const getWatchTarget = (
  options:[LanucherOption]
)=>
  // options.includes("--package-conf")
  options.includes("--modules-file")?'node_modules':'package.json';
