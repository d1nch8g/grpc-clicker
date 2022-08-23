import { Memento } from "vscode";

/**
 * Entity representing host and it's options
 */
export interface Host {
  /**
   * Entity representing host and it's options
   */
  adress: string;
  /**
   * Entity representing host and it's options
   */
  plaintext: boolean;
}

export class Hosts {
  private readonly key: string = "grpc-clicker-hosts";
  constructor(private memento: Memento) {}

  save(hosts: Host[]) {
    this.memento.update(this.key, JSON.stringify(hosts));
  }

  get(): Host[] {
    const hosts = this.memento.get<string>(
      this.key,
      `[{"adress":"localhost:8080","plaintext":true}]`
    );
    return JSON.parse(hosts);
  }
}
