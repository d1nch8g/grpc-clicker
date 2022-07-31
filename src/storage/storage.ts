import { Memento } from "vscode";
import { Headers } from "./headers";
import { History } from "./history";
import { Hosts } from "./hosts";
import { Protos as Protos } from "./protos";

export class Storage {
  public hosts: Hosts;
  public protos: Protos;
  public metas: Headers;
  public history: History;
  constructor(memento: Memento) {
    this.hosts = new Hosts(memento);
    this.protos = new Protos(memento);
    this.metas = new Headers(memento);
    this.history = new History(memento);
  }
}
