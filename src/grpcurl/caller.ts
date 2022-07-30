import * as util from "util";

export class Caller {
  async executeCommand(form: string, args: string[]): Promise<[string, Error]> {
    try {
      const call = util.format(form, ...args);

      const exec = util.promisify(require("child_process").exec);
      const { stdout, stderr } = await exec(call);

      const stdoutString = `${stdout}`;
      const stderrString = `${stderr}`;

      if (stderrString !== ``) {
        return [null, new Error(stderrString)];
      }

      return [stdoutString, null];
    } catch (exception) {
      return [null, new Error(exception.message)];
    }
  }
}
