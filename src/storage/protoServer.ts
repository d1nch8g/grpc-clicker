import { Memento } from "vscode";
import { ServerSource } from "../grpcurl/caller";
import { Proto } from "../grpcurl/parser";

/**
 * Entity representing proto schema and server source
 */
export interface ProtoServer {
  /**
   * Entity representing server source for recieving proto schema
   */
  source: ServerSource;
  /**
   * Parsed proto schema with services
   */
  proto: Proto;
}

export class ProtoServers {
  private readonly key: string = "grpc-clicker-hosts";
  constructor(private memento: Memento) {}

  save(hosts: ProtoServer[]) {
    let hostsStrings: string[] = [];
    for (const host of hosts) {
      hostsStrings.push(JSON.stringify(host));
    }
    this.memento.update(this.key, hostsStrings);
  }

  list(): ProtoServer[] {
    let hostsStrings = this.memento.get<string[]>(this.key, []);
    let hosts: ProtoServer[] = [];
    for (const hostString of hostsStrings) {
      hosts.push(JSON.parse(hostString));
    }
    return hosts;
  }

  add(host: ProtoServer): Error | undefined {
    const hosts = this.list();
    for (const savedProtoServer of hosts) {
      if (savedProtoServer.source.host === host.source.host) {
        return new Error(`host you are trying to add already exists`);
      }
    }
    hosts.push(host);
    this.save(hosts);
    return undefined;
  }

  remove(hostAdress: string) {
    const hosts = this.list();
    for (let i = 0; i < hosts.length; i++) {
      if (hosts[i].source.host === hostAdress) {
        hosts.splice(i, 1);
      }
    }
    this.save(hosts);
  }
}
