import { Memento } from "vscode";
import { Hosts } from "./hosts";
import { Protos as Protos } from "./protos";

export class Storage {
  public hosts: Hosts;
  public protos: Protos;
  constructor(memento: Memento) {
    this.hosts = new Hosts(memento);
    this.protos = new Protos(memento);
  }
}
