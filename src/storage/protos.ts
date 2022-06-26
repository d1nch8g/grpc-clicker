import * as vscode from "vscode";
import { Memento } from "vscode";
import { Proto } from "../grpcurl/proto";

export class Protos {
  private protosKey: string;
  constructor(private memento: Memento) {
    this.protosKey = "grpc-clicker-structures";
  }

  public list(): string[] {
    let protos = this.memento.get<Proto[]>(this.protosKey, []);
    let pathes: string[] = [];
    protos.forEach((proto) => {
      pathes.push(proto.path);
    });
    return pathes;
  }

  public add(path: string): string[] {
    let pathes = this.memento.get<string[]>(this.protosKey, []);
    if (path === "") {
      return pathes;
    }
    if (pathes.includes(path)) {
      let msg = `Proto you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return pathes;
    }
    pathes.push(path);
    this.memento.update(this.protosKey, pathes);
    return pathes;
  }

  public remove(adress: string): string[] {
    let adresses = this.memento.get<string[]>(this.protosKey, []);
    let idx = adresses.indexOf(adress);
    if (idx !== -1) {
      adresses.splice(idx, 1);
    }
    this.memento.update(this.protosKey, adresses);
    return adresses;
  }
}
