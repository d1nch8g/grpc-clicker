import { Memento } from "vscode";

export class Docker {
  private readonly key: string = "grpc-clicker-docker";
  constructor(private memento: Memento) {}

  isOn(): boolean {
    let useDocker = this.memento.get(this.key, false);
    return useDocker;
  }

  turnOn() {
    this.memento.update(this.key, true);
  }

  turnOff() {
    this.memento.update(this.key, false);
  }
}
