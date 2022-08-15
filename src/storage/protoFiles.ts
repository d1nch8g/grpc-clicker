import { Memento } from "vscode";
import { Host, ProtoFile } from "../grpcurl/grpcurl";

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
      if (savedProtoFile.path === proto.path) {
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
      if (protos[i].path === path) {
        protos.splice(i, 1);
      }
    }
    this.save(protos);
  }

  addHost(path: string, host: Host) {
    const protos = this.list();
    for (const savedProtoFile of protos) {
      if (savedProtoFile.path === path) {
        savedProtoFile.hosts.push(host);
      }
    }
    this.save(protos);
  }

  removeHost(path: string, host: Host) {
    const protos = this.list();
    for (const savedProtoFile of protos) {
      if (savedProtoFile.path === path) {
        for (const [i, savedHost] of savedProtoFile.hosts.entries()) {
          if (host.adress === savedHost.adress) {
            savedProtoFile.hosts.splice(i, 1);
          }
        }
      }
    }
    this.save(protos);
  }

  updateImportPath(protoPath: string, newImportPath: string) {
    const protos = this.list();
    for (const savedProtoFile of protos) {
      if (savedProtoFile.path === protoPath) {
        savedProtoFile.importPath = newImportPath;
      }
    }
    this.save(protos);
  }
}
