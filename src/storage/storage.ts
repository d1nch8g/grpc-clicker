import { Memento } from "vscode";
import { Hosts } from "./hosts";
import { Protos as Protos } from "./protos";

export class Storage {
  public adresses: Hosts;
  public protos: Protos;
  constructor(memento: Memento) {
    this.adresses = new Hosts(memento);
    this.protos = new Protos(memento);
  }
}
