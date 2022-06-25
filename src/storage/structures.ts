import * as vscode from "vscode";
import { Memento } from "vscode";
import { Structure } from "../grpcurl/structure";

export class Structures {
  private structuresKey: string;
  constructor(private memento: Memento) {
    this.structuresKey = "grpc-clicker-structures";
  }

  public list(): Structure[] {
    let structures = this.memento.get<Structure[]>(this.structuresKey, []);
    return structures;
  }

  public add(newStructure: Structure) {
    let structures = this.memento.get<Structure[]>(this.structuresKey, []);
    structures.forEach((storageStructure) => {
      if (newStructure.path === storageStructure.path) {
        let msg = `This proto file already exists!`;
        vscode.window.showErrorMessage(msg);
        return;
      }
    });
    structures.push(newStructure);
    this.memento.update(this.structuresKey, structures);
  }

  public remove(path: string) {
    let structures = this.memento.get<Structure[]>(this.structuresKey, []);
    structures.forEach((structure, idx) => {
      if (structure.path === path) {
        structures.splice(idx, 1);
      }
    });
    this.memento.update(this.structuresKey, structures);
  }
}
