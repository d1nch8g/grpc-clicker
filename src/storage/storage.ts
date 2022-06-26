import { Memento } from "vscode";
import { Adresses } from "./adresses";
import { Protos as Protos } from "./protos";

export class Storage {
  public adresses: Adresses;
  public protos: Protos;
  constructor(memento: Memento) {
    this.adresses = new Adresses(memento);
    this.protos = new Protos(memento);
  }
}
