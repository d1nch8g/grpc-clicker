import * as vscode from "vscode";
import { Memento } from "vscode";
import { Host } from "../classes/host";

export class Hosts {
  private readonly key: string = "grpc-clicker-hosts";
  private readonly currentHostKey: string = "grpc-clicker-curHost";
  constructor(private memento: Memento) {}

  private listToHosts(hosts: string[]): Host[] {
    let metas: Host[] = [];
    for (const name of hosts) {
      metas.push(new Host(name, this.isCurrent(name)));
    }
    return metas;
  }

  private isCurrent(host: string): boolean {
    return this.memento.get<boolean>(`${this.key}:${host}`, false);
  }

  public hosts(): Host[] {
    let hosts = this.memento.get<string[]>(this.key, []);
    return this.listToHosts(hosts);
  }

  public list(): string[] {
    let hosts = this.memento.get<string[]>(this.key, []);
    return hosts;
  }

  public add(host: string): Host[] {
    let hosts = this.memento.get<string[]>(this.key, []);
    if (host === "") {
      return this.listToHosts(hosts);
    }
    if (hosts.includes(host)) {
      let msg = `Host you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return this.listToHosts(hosts);
    }
    hosts.push(host);
    this.memento.update(this.key, hosts);
    return this.listToHosts(hosts);
  }

  public remove(host: string): Host[] {
    let hosts = this.memento.get<string[]>(this.key, []);
    let idx = hosts.indexOf(host);
    if (idx !== -1) {
      hosts.splice(idx, 1);
    }
    this.memento.update(this.key, hosts);
    return this.listToHosts(hosts);
  }

  public getCurret(): string {
    return this.memento.get<string>(this.currentHostKey, ``);
  }

  public setCurret(host: string): Host[] {
    let previous = this.getCurret();
    this.memento.update(`${this.key}:${previous}`, false);
    this.memento.update(this.currentHostKey, host);
    this.memento.update(`${this.key}:${host}`, true);
    return this.hosts();
  }
}
