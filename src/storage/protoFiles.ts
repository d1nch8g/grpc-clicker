import { Memento } from "vscode";
import { FileSource } from "../grpcurl/caller";
import { Proto } from "../grpcurl/parser";

/**
 * Entity representing proto wil file with source
 */
export interface ProtoFile extends Proto {
  /**
   * File in file system and import path for other proto files. File name is
   * checked to be unique in storage.
   */
  source: FileSource;
}

export class ProtoFiles {
  private readonly key: string = "grpc-clicker-structures";
  constructor(private memento: Memento) {}

  save(protos: ProtoFile[]) {
    let protosStrings: string[] = [];
    for (const proto of protos) {
      protosStrings.push(JSON.stringify(proto));
    }
    this.memento.update(this.key, protosStrings);
  }

  list(): ProtoFile[] {
    let protosStrings = this.memento.get<string[]>(this.key, []);
    let protos: ProtoFile[] = [];
    for (const protoString of protosStrings) {
      protos.push(JSON.parse(protoString));
    }
    return protos;
  }

  add(proto: ProtoFile): Error | undefined {
    const protos = this.list();
    for (const savedProtoFile of protos) {
      if (savedProtoFile.source.filePath === proto.source.filePath) {
        return new Error(`proto file you are trying to add already exists`);
      }
    }
    protos.push(proto);
    this.save(protos);
    return undefined;
  }

  /**
   * Remove proto file using unique file name from storage.
   */
  remove(path: string) {
    const protos = this.list();
    for (let i = 0; i < protos.length; i++) {
      if (protos[i].source.filePath === path) {
        protos.splice(i, 1);
      }
    }
    this.save(protos);
  }

  updateImportPath(protoPath: string, newImportPath: string) {
    const protos = this.list();
    for (const savedProtoFile of protos) {
      if (savedProtoFile.source.filePath === protoPath) {
        savedProtoFile.source.importPath = newImportPath;
      }
    }
    this.save(protos);
  }
}
