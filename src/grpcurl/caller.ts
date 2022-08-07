import * as util from "util";

export class Caller {
  async execute(call: string): Promise<[string, Error | undefined]> {
    try {
      const exec = util.promisify(require("child_process").exec);
      const { stdout, stderr } = await exec(call);

      const stdoutString = `${stdout}`;
      const stderrString = `${stderr}`;

      if (stderrString !== ``) {
        return [``, new Error(stderrString)];
      }

      return [stdoutString, undefined];
    } catch (exception) {
      return [``, new Error(`${exception}`)];
    }
  }
}
