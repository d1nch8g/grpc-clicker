import { Memento } from "vscode";

export class Protos {
  private readonly key: string = "grpc-clicker-structures";
  constructor(private memento: Memento) {}

  public list(): string[] {
    let pathes = this.memento.get<string[]>(this.key, []);
    return pathes;
  }

  public add(path: string): [string[], Error] {
    let pathes = this.memento.get<string[]>(this.key, []);
    if (path === "") {
      return [pathes, null];
    }
    if (pathes.includes(path)) {
      let msg = `Proto you are trying to add already exists!`;
      return [pathes, new Error(msg)];
    }
    pathes.push(path);
    this.memento.update(this.key, pathes);
    return [pathes, null];
  }

  public remove(host: string): string[] {
    let hosts = this.memento.get<string[]>(this.key, []);
    let idx = hosts.indexOf(host);
    if (idx !== -1) {
      hosts.splice(idx, 1);
    }
    this.memento.update(this.key, hosts);
    return hosts;
  }
}
