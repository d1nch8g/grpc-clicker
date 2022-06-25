import * as vscode from "vscode";
import { Memento } from "vscode";
import { Proto } from "../grpcurl/proto";

export class Protos {
  private protosKey: string;
  constructor(private memento: Memento) {
    this.protosKey = "grpc-clicker-structures";
  }

  public list(): Proto[] {
    let protos = this.memento.get<Proto[]>(this.protosKey, []);
    return protos;
  }

  public pathes(): string[] {
    let protos = this.memento.get<Proto[]>(this.protosKey, []);
    let pathes: string[] = [];
    protos.forEach((proto) => {
      pathes.push(proto.path);
    });
    return pathes;
  }

  public add(newProto: Proto) {
    let protos = this.memento.get<Proto[]>(this.protosKey, []);
    protos.forEach((storageProto) => {
      if (newProto.path === storageProto.path) {
        let msg = `This proto file already exists!`;
        vscode.window.showErrorMessage(msg);
        return;
      }
    });
    protos.push(newProto);
    this.memento.update(this.protosKey, protos);
  }

  public remove(path: string) {
    let protos = this.memento.get<Proto[]>(this.protosKey, []);
    protos.forEach((structure, idx) => {
      if (structure.path === path) {
        protos.splice(idx, 1);
      }
    });
    this.memento.update(this.protosKey, protos);
  }
}
