import * as util from "util";
import * as fs from "fs";

const baseLink = `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/`;

export class Installer {
  getDownloadUrl(): string | undefined {
    const os = require("os");
    switch (`${process.platform}_${os.arch()}`) {
      case `win32_x32`:
        return baseLink + `grpcurl_1.8.7_windows_x86_32.zip`;
      case `win32_x64`:
        return baseLink + `grpcurl_1.8.7_windows_x86_64.zip`;
      case `darwin_x64`:
        return baseLink + `grpcurl_1.8.7_osx_x86_64.tar.gz`;
      case `darwin_arm64`:
        return baseLink + `grpcurl_1.8.7_osx_arm64.tar.gz`;
      case `linux_x64`:
        return baseLink + `grpcurl_1.8.7_linux_x86_64.tar.gz`;
      case `linux_x32`:
        return baseLink + `grpcurl_1.8.7_linux_x86_32.tar.gzp`;
      case `linux_s390x`:
        return baseLink + `grpcurl_1.8.7_linux_s390x.tar.gz`;
      case `linux_ppc64`:
        return baseLink + `grpcurl_1.8.7_linux_ppc64le.tar.gz`;
      case `linux_arm64`:
        return baseLink + `grpcurl_1.8.7_linux_arm64.tar.gz`;
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
    var unzip = require("unzip-stream");
    var fs = require("fs-extra");
    await fs.createReadStream(file).pipe(unzip.Extract({ path: dir }));
    for (let i = 0; i < 1500; i++) {
      if (fs.existsSync(`${dir}/LICENSE`)) {
        return true;
      }
    }
    return false;
  }
}
