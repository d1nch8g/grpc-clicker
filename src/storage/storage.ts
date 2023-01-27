import { Memento } from "vscode";
import { Header, Headers } from "./headers";
import { History } from "./history";
import { Collection, Collections } from "./collections";
import { Protos } from "./protos";
import { Proto } from "../grpcurl/grpcurl";

/**
 * Dump of all relevant data of for storage
 */
export interface Dump {
  headers: Header[];
  protos: Proto[];
  collections: Collection[];
}

export class Storage {
  private readonly key: string = `grpc-clicker-version`;

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

  export(): Dump {
    const dump: Dump = {
      headers: this.headers.list(),
      protos: this.protos.list(),
      collections: this.collections.list(),
    };
    return dump;
  }

  import(dump: Dump) {
    this.headers.save(dump.headers);
    this.protos.save(dump.protos);
    this.collections.save(dump.collections);
  }

  private updateSchema() {
    const lastversion = this.memento.get<string>(this.key, `nan`);
    if (lastversion.startsWith(`1.`)) {
      return;
    }
    this.clean();
    this.memento.update(`grpc-clicker-version`, `1.0.2`);
  }
}
