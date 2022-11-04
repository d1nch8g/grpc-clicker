import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { ProtoServers } from "./protoServer";
import { ProtoFiles } from "./protoFiles";
import { Collections } from "./collections";
import { Hosts } from "./hosts";

export class Storage {
  public readonly key: string = `grpc-clicker-version`;
  public readonly version: string = `0.0.8`;

  public readonly collections: Collections;
  public readonly headers: Headers;
  public readonly history: History;
  public readonly hosts: Hosts;
  public readonly files: ProtoFiles;
  public readonly servers: ProtoServers;

  constructor(private memento: Memento) {
    this.files = new ProtoFiles(memento);
    this.servers = new ProtoServers(memento);
    this.headers = new Headers(memento);
    this.history = new History(memento);
    this.collections = new Collections(memento);
    this.hosts = new Hosts(memento);
    this.updateSchema();
  }

  clean() {
    for (const key of this.memento.keys()) {
      this.memento.update(key, undefined);
    }
  }

  updateSchema() {
    const lastversion = this.memento.get<string>(this.key, `nan`);
    switch (lastversion) {
      case `0.1.7`:
        this.addTimeoutToServerSources();
        this.memento.update(this.key, this.version);
        return;
      case this.version:
        return;
      default:
        this.clean();
    }
  }

  addTimeoutToServerSources() {
    let servers = this.servers.list();
    for (let i = 0; i < servers.length; i++) {
      if (servers[i].source.timeout === undefined) {
        servers[i].source.timeout = 0.5;
      }
    }
    this.servers.save(servers);
  }
}
