import * as util from "util";

export class Caller {
  async execute(
    form: string,
    args: string[],
    inDocker: boolean
  ): Promise<[string, Error]> {
    try {
      let call = util.format(form, ...args);

      if (inDocker) {
        call = this.dockerize(call);
      }

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

  dockerize(input: string): string {
    if (!input.includes(`-proto `)) {
      return input.replace(`grpcurl `, `docker run fullstorydev/grpcurl `);
    }
    if (process.platform === "win32") {
      const protoSplitted = input.split(`-proto `)[1];
      const windowsPath = protoSplitted.split(` `)[0];
      const linuxPath = windowsPath.split(`:`)[1];
      input = input.replace(windowsPath, linuxPath);
      return input.replace(
        `grpcurl `,
        `docker run -v ${windowsPath}:${linuxPath} fullstorydev/grpcurl `
      );
    }
    const path = input.split(`-proto `)[1].split(` `)[0];
    return input.replace(
      `grpcurl `,
      `docker run -v ${path}:${path} fullstorydev/grpcurl `
    );
  }
}
