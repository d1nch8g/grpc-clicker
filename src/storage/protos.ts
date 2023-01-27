import { Memento } from "vscode";
import { Proto } from "../grpcurl/grpcurl";

export class Protos {
  constructor(private memento: Memento) {}

  save(protos: Proto[]) {
    this.memento.update(`protos`, protos);
  }

  list(): Proto[] {
    return this.memento.get(`protos`, []);
  }

  add(source: Proto) {
    const protos = this.list();
    protos.push(source);
    this.save(protos);
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
