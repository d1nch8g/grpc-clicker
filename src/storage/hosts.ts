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
    let resp: string[] = [];
    for (const host of hosts) {
      resp.push(JSON.stringify(host));
    }
    this.memento.update(this.key, resp);
  }

  get(): Host[] {
    const hosts = this.memento.get<string[]>(this.key, []);
    if (hosts.length === 0) {
      return [{ adress: `localhost:8080`, plaintext: true }];
    }
    let resp: Host[] = [];
    for (const host of hosts) {
      resp.push(JSON.parse(host));
    }
    return resp;
  }
}
