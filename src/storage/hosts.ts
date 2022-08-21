import { Memento } from "vscode";

/**
 * Options for choosing hosts for further gRPC calls
 */
export interface HostsOptions {
  /**
   * Current host for gRPC calls, example: `localhost:8080`
   */
  current: string;
  /**
   * List of available host options
   */
  hosts: string[];
}

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
