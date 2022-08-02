import { Memento } from "vscode";

export class Hosts {
  private readonly key: string = "grpc-clicker-hosts";
  constructor(private memento: Memento) {}

  save(hosts: Host[]) {
    let hostsStrings: string[] = [];
    for (const host of hosts) {
      hostsStrings.push(JSON.stringify(host));
    }
    this.memento.update(this.key, hostsStrings);
  }

  list(): Host[] {
    let hostsStrings = this.memento.get<string[]>(this.key, []);
    let hosts: Host[] = [];
    for (const hostString of hostsStrings) {
      hosts.push(JSON.parse(hostString));
    }
    return hosts;
  }

  add(host: Host): Error {
    const hosts = this.list();
    for (const savedHost of hosts) {
      if (savedHost.adress === host.adress) {
        return new Error(`host you are trying to add already exists`);
      }
    }
    hosts.push(host);
    this.save(hosts);
    return null;
  }

  remove(hostAdress: string) {
    const hosts = this.list();
    for (let i = 0; i < hosts.length; i++) {
      if (hosts[i].adress === hostAdress) {
        hosts.splice(i, 1);
      }
    }
    this.save(hosts);
  }
}

export interface Host {
  adress: string;
  description: string;
  current: boolean;
}
