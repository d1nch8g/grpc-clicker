import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { ProtoServers } from "./protoServer";
import { ProtoFiles } from "./protoFiles";
import { Collections } from "./collections";
import { Hosts } from "./hosts";

export class Storage {
  public readonly collections: Collections;
  public readonly headers: Headers;
  public readonly history: History;
  public readonly hosts: Hosts;
  public readonly files: ProtoFiles;
  public readonly servers: ProtoServers;

  constructor(private memento: Memento) {
    memento.update(`grpc-clicker-version`, "0.1.6");
    this.files = new ProtoFiles(memento);
    this.servers = new ProtoServers(memento);
    this.headers = new Headers(memento);
    this.history = new History(memento);
    this.collections = new Collections(memento);
    this.hosts = new Hosts(memento);
  }

  clean() {
    for (const key of this.memento.keys()) {
      this.memento.update(key, undefined);
    }
  }
}
