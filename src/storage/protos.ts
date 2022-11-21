import { Memento } from "vscode";
import { ProtoSource } from "../grpcurl/caller";


export class Protos {
  private readonly key: string = "grpc-clicker-sources";
  constructor(private memento: Memento) { }

  save(hosts: ProtoSource[]) {
    let hostsStrings: string[] = [];
    for (const host of hosts) {
      hostsStrings.push(JSON.stringify(host));
    }
    this.memento.update(this.key, hostsStrings);
  }

  list(): ProtoSource[] {
    let hostsStrings = this.memento.get<string[]>(this.key, []);
    let hosts: ProtoSource[] = [];
    for (const hostString of hostsStrings) {
      hosts.push(JSON.parse(hostString));
    }
    return hosts;
  }

  add(source: ProtoSource): Error | undefined {
    const hosts = this.list();
    for (const savedSource of hosts) {
      if (source.uuid === savedSource.uuid) {
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
      if (hosts[i].uuid === uuid) {
        hosts.splice(i, 1);
      }
    }
    this.save(hosts);
  }
}
