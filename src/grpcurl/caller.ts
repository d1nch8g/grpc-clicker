import * as util from "util";

/**
 * Combined structure containing all required information for proto file.
 */
export interface ProtoSource {
  /**
   * Current host, which will be used for calls processing (real adress)
   */
  currentHost: string;
  /**
   * Additional hosts that could be specified for further calls, optional.
   */
  additionalHosts: string[];
  /**
   * Wether to use TLS.
   */
  plaintext: boolean;
  /**
   * Default timeout for call execution.
   */
  timeout: number;
  /**
   * Files that would be used as base in `-proto` arguement
   */
  filePath: string | undefined;
  /**
   * Group that will be used to store proto information.
   */
  group: string | undefined;
  /**
   * Paths that needs to be imported for proper proto compilation.
   */
  importPaths: string[];
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
   * Specify source of execution, that might be server of file
   */
  source: ProtoSource;
  /**
   * Arguements that will be included in final version CLI command
   */
  args: string[];
}

/**
 * Class that is used for CLI commands building and processing
 */
export class Caller {
  /**
   * This function is used to build cli command from parameters
   */
  buildCliCommand(input: FormCliTemplateParams): string {
    let base: string = ``;
    if (input.source.filePath !== undefined) {
      for (const importPath of input.source.importPaths) {
        base += ` -import-path ${importPath}`
      }
      base += ` -proto ${input.source.filePath}`;
    } else {
      if (input.source.plaintext) {
        base += ` -plaintext`;
      }
      base += ` -max-time ${input.source.timeout} ${input.source.currentHost} `;
    }
    input.cliCommand = input.cliCommand.replace(`|SRC|`, base);
    let command = util.format(input.cliCommand, ...input.args);
    return command;
  }

  /**
   * Class that is used for CLI commands building and processing
   */
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
}
