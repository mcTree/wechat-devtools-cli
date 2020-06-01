enum LanucherOptionsEnum {
  "--cli",
  "--http",
  "--watch",
  "--lib",
  "--project",
  "--win32",
  "--posix",
  "--modules-file",
  "--package-conf"
}

enum CommandEnum {
  "open",
  "build-npm",
}

type SystemFlag ='win32'|'posix'|''
type ExecuterMode = "cli"|"http"
type Command = keyof typeof CommandEnum;
type LanucherOption = keyof typeof LanucherOptionsEnum;

type ModeExecutor = (command:Command,...rest:string[]) =>any;

type CommandFunc = (executor:ModeExecutor,...rest:any) =>Promise<any>;
