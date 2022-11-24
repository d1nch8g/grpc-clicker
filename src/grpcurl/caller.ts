import * as util from "util";

/**
 * Combined structure containing all required information for proto file.
 */
export interface ProtoSource {
  /**
   * Unique identifier for specific source.
   */
  uuid: string;
  /**
   * Human readable name for proto source.
   */
  name: string;
  /**
   * Group that will be used to store proto information.
   */
  group: string | undefined;
  /**
   * Current host:port, which will be used for calls processing (real adress)
   */
  adress: string;
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
  /**
   * Arguements that will be included in final version CLI command
   */
  forceMultisource: boolean;
  /**
   * Arg, that explictly forces caller to use all provided info about sources.
   */
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
        base += ` -import-path ${importPath}`;
      }
      base += ` -proto ${input.source.filePath}`;
    } else {
      if (input.source.plaintext) {
        base += ` -plaintext`;
      }
      base += ` -max-time ${input.source.timeout} ${input.source.adress} `;
    }
    if (input.forceMultisource) {
      if (input.source.plaintext) {
        base += ` -plaintext`;
      }
      base += ` -max-time ${input.source.timeout} ${input.source.adress} `;
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
