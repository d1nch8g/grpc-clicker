import * as util from "util";

export class Caller {
  async execute(call: string): Promise<[string, Error]> {
    try {
      const exec = util.promisify(require("child_process").exec);
      const { stdout, stderr } = await exec(call);

      const stdoutString = `${stdout}`;
      const stderrString = `${stderr}`;

      if (stderrString !== ``) {
        return [undefined, new Error(stderrString)];
      }

      return [stdoutString, undefined];
    } catch (exception) {
      return [undefined, new Error(exception.message)];
    }
  }
}
