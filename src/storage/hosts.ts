import { Memento } from "vscode";

export class Hosts {
  private readonly key: string = "grpc-clicker-hosts";
  private readonly nullhost = `{"current":"localhost:8080","hosts":[]}`;
  constructor(private memento: Memento) {}

  save(hosts: HostsOptions) {
    this.memento.update(this.key, JSON.stringify(hosts));
  }

  get(): HostsOptions {
    const hosts = this.memento.get<string>(this.key, this.nullhost);
    return JSON.parse(hosts);
  }
}

export interface HostsOptions {
  current: string;
  hosts: string[];
}
