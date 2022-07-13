import { Memento } from "vscode";
import { Hosts } from "./hosts";
import { Metadata as Metas } from "./metas";
import { Protos as Protos } from "./protos";

export class Storage {
  public hosts: Hosts;
  public protos: Protos;
  public metas: Metas;
  constructor(memento: Memento) {
    this.hosts = new Hosts(memento);
    this.protos = new Protos(memento);
    this.metas = new Metas(memento);
  }
}
