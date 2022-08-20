import * as util from "util";

export class Caller {
  formSource(input: FormCliTemplateParams): string {
    let source: string;
    if (input.source.type === `SERVER`) {
      if (input.source.plaintext) {
        source = `-plaintext ${input.source.host}`;
      } else {
        source = `${input.source.host}`;
      }
    }
    if (input.source.type === `FILE`) {
      source = `-import-path ${input.source.importPath} -proto ${input.source.filePath}`;
    }

    input.cliCommand = input.cliCommand.replace(`|SRC|`, source!);

    let command = util.format(input.cliCommand, ...input.args);

    if (input.useDocker) {
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

/**
 * Description of server source for CLI command
 */
export interface ServerSource {
  type: `SERVER`;
  host: string;
  plaintext: boolean;
}

/**
 * Description of file source for CLI command
 */
export interface FileSource {
  type: `FILE`;
  filePath: string;
  importPath: string;
}

/**
 * Entity used to form cli template for other gRPCurl parameters
 */
export interface FormCliTemplateParams {
  /**
   * CLI command that will be transformed:
   * - Example: `grpcurl -emit-defaults %s %s -d %s |SRC| %s`
   * - `|SRC|` will be automatically replaced with proper source wether it's file
   * or server command
   */
  cliCommand: string;
  /**
   * Wether docker should be used for call execution
   */
  useDocker: boolean;
  /**
   * Specify source of execution, that might be server of file
   */
  source: ServerSource | FileSource;
  /**
   * Arguements that will be included in final version CLI command
   */
  args: string[];
}
