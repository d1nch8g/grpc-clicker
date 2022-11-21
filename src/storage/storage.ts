import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { Collections } from "./collections";
import { Protos } from "./protos";

export class Storage {
  public readonly key: string = `grpc-clicker-version`;
  public readonly version: string = `0.1.9`;

  public readonly collections: Collections;
  public readonly headers: Headers;
  public readonly history: History;
  public readonly protos: Protos;

  constructor(private memento: Memento) {
    this.headers = new Headers(memento);
    this.history = new History(memento);
    this.collections = new Collections(memento);
    this.protos = new Protos(memento);
    this.updateSchema();
  }

  clean() {
    for (const key of this.memento.keys()) {
      this.memento.update(key, undefined);
    }
  }

  updateSchema() {
    const lastversion = this.memento.get<string>(this.key, `nan`);
    switch (lastversion) {
      case this.version:
        return;
      default:
        this.clean();
    }
  }
}
