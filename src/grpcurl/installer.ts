import fetch from "node-fetch";

const baseLink = `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/`;

export class Installer {
  getDownloadLink(): string | undefined {
    const os = require("os");
    let downloadPath: string | undefined;
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

  async download(uri: string, file: string) {
    const response = await fetch(uri);
    const data = await response.json();
  }

  install(path: string): boolean {
    return false;
  }
}
