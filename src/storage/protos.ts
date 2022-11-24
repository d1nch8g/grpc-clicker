import { Memento } from "vscode";
import { Proto } from "../grpcurl/grpcurl";

export class Protos {
  private readonly key: string = "grpc-clicker-sources";
  constructor(private memento: Memento) { }

  save(hosts: Proto[]) {
    let protosStrings: string[] = [];
    for (const host of hosts) {
      protosStrings.push(JSON.stringify(host));
    }
    this.memento.update(this.key, protosStrings);
  }

  list(): Proto[] {
    let hostsStrings = this.memento.get<string[]>(this.key, []);
    let proto: Proto[] = [];
    for (const hostString of hostsStrings) {
      proto.push(JSON.parse(hostString));
    }
    return proto;
  }

  add(source: Proto): Error | undefined {
    const protos = this.list();
    for (const savedSource of protos) {
      if (source.source.uuid === savedSource.source.uuid) {
        return new Error(`host you are trying to add already exists`);
      }
    }
    protos.push(source);
    this.save(protos);
    return undefined;
  }

  remove(uuid: string) {
    const protos = this.list();
    for (let i = 0; i < protos.length; i++) {
      if (protos[i].source.uuid === uuid) {
        protos.splice(i, 1);
      }
    }
    this.save(protos);
  }
}
