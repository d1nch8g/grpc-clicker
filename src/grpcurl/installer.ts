import * as util from "util";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as unzip from "unzip-stream";

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
    if (process.platform === `win32`) {
      const zipStream = fse
        .createReadStream(file)
        .pipe(unzip.Extract({ path: dir }));
      await new Promise((fin) => zipStream.on("finish", fin));
    } else {
      
    }
    fs.rmSync(file);
    return fs.existsSync(`${dir}/LICENSE`);
  }
}
