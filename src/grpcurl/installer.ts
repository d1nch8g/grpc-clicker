import * as util from "util";
import * as fs from "fs";

const baseLink = `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/`;

export class Installer {
  getDownloadUrl(): string | undefined {
    const os = require("os");
    switch (process.platform) {
      case `win32`:
        switch (os.arch()) {
          case "x32":
            return baseLink + `grpcurl_1.8.7_windows_x86_32.zip`;
          case "x64":
            return baseLink + `grpcurl_1.8.7_windows_x86_64.zip`;
        }
      case `darwin`:
        switch (os.arch()) {
          case "x64":
            return baseLink + `grpcurl_1.8.7_osx_x86_64.tar.gz`;
          case "arm64":
            return baseLink + `grpcurl_1.8.7_osx_arm64.tar.gz`;
        }
      case `linux`:
        switch (os.arch()) {
          case "x64":
            return baseLink + `grpcurl_1.8.7_linux_x86_64.tar.gz`;

          case "x32":
            return baseLink + `grpcurl_1.8.7_linux_x86_32.tar.gzp`;

          case "s390x":
            return baseLink + `grpcurl_1.8.7_linux_s390x.tar.gz`;

          case "ppc64":
            return baseLink + `grpcurl_1.8.7_linux_ppc64le.tar.gz`;

          case "arm64":
            return baseLink + `grpcurl_1.8.7_linux_arm64.tar.gz`;
        }
    }
    return undefined;
  }

  async download(url: string, file: string): Promise<boolean> {
    const command = `curl -L ${url} -o ${file}`;
    const exec = util.promisify(require("child_process").exec);
    await exec(command);
    return fs.existsSync(file);
  }

  async unzip(file: string, dir: string): Promise<boolean> {
    const command = `unzip -d ${dir} ${file}`;
    const exec = util.promisify(require("child_process").exec);
    await exec(command);
    return fs.existsSync(`${dir}/LICENSE`);
  }
}
