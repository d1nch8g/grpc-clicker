import { Memento } from "vscode";
import { Proto } from "../grpcurl/parser";

export class Protos {
  private readonly key: string = "grpc-clicker-structures";
  constructor(private memento: Memento) {}

  save(protos: Proto[]) {
    let protosStrings: string[] = [];
    for (const proto of protos) {
      protosStrings.push(JSON.stringify(proto));
    }
    this.memento.update(this.key, protosStrings);
  }

  list(): Proto[] {
    let protosStrings = this.memento.get<string[]>(this.key, []);
    let protos: Proto[] = [];
    for (const protoString of protosStrings) {
      protos.push(JSON.parse(protoString));
    }
    return protos;
  }

  public add(proto: Proto): Error | undefined {
    const protos = this.list();
    for (const savedProto of protos) {
      if (savedProto.source === proto.source) {
        return new Error(`proto file you are trying to add already exists`);
      }
    }
    protos.push(proto);
    this.save(protos);
    return undefined;
  }

  remove(path: string) {
    const protos = this.list();
    for (let i = 0; i < protos.length; i++) {
      if (protos[i].source === path) {
        protos.splice(i, 1);
      }
    }
    this.save(protos);
  }
}
