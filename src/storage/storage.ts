import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { Hosts } from "./hosts";
import { Protos as Protos } from "./protos";

export class Storage {
  public hosts: Hosts;
  public protos: Protos;
  public headers: Headers;
  public history: History;

  constructor(private memento: Memento) {
    if (memento.get(`grpc-clicker-version`) !== "0.0.15") {
      for (const key of memento.keys()) {
        memento.update(key, undefined);
      }
    }
    memento.update(`grpc-clicker-version`, "0.0.15");
    this.hosts = new Hosts(memento);
    this.protos = new Protos(memento);
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
