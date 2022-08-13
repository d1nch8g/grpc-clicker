import * as util from "util";

export class Caller {
  formSource(input: RequestForm): string {
    let source = input.source;
    if (!input.server) {
      source = `-import-path ${input.importPath} -proto ${source}`;
    }
    if (input.plaintext) {
      source = `-plaintext ${source}`;
    }
    input.call = input.call.replace(`|SRC|`, source);

    let command = util.format(input.call, ...input.args);

    if (input.docker) {
      command = this.dockerize(command);
    }
    return command;
  }

  async execute(command: string): Promise<[string, Error | undefined]> {
    try {
      const exec = util.promisify(require("child_process").exec);
      const { stdout, stderr } = await exec(command);

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

export interface RequestForm {
  call: string;
  source: string;
  server: boolean;
  plaintext: boolean;
  docker: boolean;
  importPath: string;
  args: string[];
}
