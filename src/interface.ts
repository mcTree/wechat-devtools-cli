enum LanucherOptionsEnum {
  "--cli",
  "--http",
  "--watch",
  "--lib",
  "--project",
}

enum CommandEnum {
  "open",
  "build-npm",
}

type Mode = "cli"|"http"
type Command = keyof typeof CommandEnum;
type LanucherOption = keyof typeof LanucherOptionsEnum;

interface ModeExecutor {
  (command:Command,...rest:string[]):any;
}

interface CommandFunc {
  (executor:ModeExecutor,...rest:any):Promise<any>;
}
