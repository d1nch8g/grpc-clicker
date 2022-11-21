import { Memento } from "vscode";
import { Proto } from "../grpcurl/grpcurl";

export class Protos {
  private readonly key: string = "grpc-clicker-sources";
  constructor(private memento: Memento) { }

  save(hosts: Proto[]) {
    let hostsStrings: string[] = [];
    for (const host of hosts) {
      hostsStrings.push(JSON.stringify(host));
    }
    this.memento.update(this.key, hostsStrings);
  }

  list(): Proto[] {
    let hostsStrings = this.memento.get<string[]>(this.key, []);
    let hosts: Proto[] = [];
    for (const hostString of hostsStrings) {
      hosts.push(JSON.parse(hostString));
    }
    return hosts;
  }

  add(source: Proto): Error | undefined {
    const hosts = this.list();
    for (const savedSource of hosts) {
      if (source.source.uuid === savedSource.source.uuid) {
        return new Error(`host you are trying to add already exists`);
      }
    }
    hosts.push(source);
    this.save(hosts);
    return undefined;
  }

  remove(uuid: string) {
    const hosts = this.list();
    for (let i = 0; i < hosts.length; i++) {
      if (hosts[i].source.uuid === uuid) {
        hosts.splice(i, 1);
      }
    }
    this.save(hosts);
  }
}
