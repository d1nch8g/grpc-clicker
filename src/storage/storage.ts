import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { ProtoServers } from "./protoServer";
import { ProtoFiles } from "./protoFiles";

export class Storage {
  public readonly files: ProtoFiles;
  public readonly servers: ProtoServers;
  public readonly headers: Headers;
  public readonly history: History;

  constructor(private memento: Memento) {
    if (memento.get(`grpc-clicker-version`) !== "0.0.18") {
      for (const key of memento.keys()) {
        memento.update(key, undefined);
      }
    }
    memento.update(`grpc-clicker-version`, "0.0.18");
    this.files = new ProtoFiles(memento);
    this.servers = new ProtoServers(memento);
    this.headers = new Headers(memento);
    this.history = new History(memento);
  }

  clean() {
    for (const key of this.memento.keys()) {
      this.memento.update(key, undefined);
    }
  }

  showInstallError(): boolean {
    if (this.memento.get(`grpcurlIsInstalled`) !== true) {
      this.memento.update(`grpcurlIsInstalled`, true);
      return true;
    }
    return false;
  }
}
