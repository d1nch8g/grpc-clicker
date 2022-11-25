import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { Collections } from "./collections";
import { Protos } from "./protos";

export class Storage {
  private readonly key: string = `grpc-clicker-version`;
  private readonly version: string = `1.0.0`;

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

  private updateSchema() {
    const lastversion = this.memento.get<string>(this.key, `nan`);
    switch (lastversion) {
      case this.version:
        return;
      default:
        this.clean();
        this.memento.update(this.key, this.version);
        return;
    }
  }
}
