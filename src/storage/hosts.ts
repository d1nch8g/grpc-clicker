import * as vscode from "vscode";
import { Memento } from "vscode";
import { Host } from "../classes/host";

export class Hosts {
  private hostsKey: string;
  private currentHostKey: string;
  constructor(private memento: Memento) {
    this.hostsKey = "grpc-clicker-hosts";
    this.currentHostKey = "grpc-clicker-curHost";
  }

  private listToHosts(hosts: string[]): Host[] {
    let metas: Host[] = [];
    for (const name of hosts) {
      metas.push(new Host(name, this.isCurrent(name)));
    }
    return metas;
  }

  private isCurrent(host: string): boolean {
    return this.memento.get<boolean>(`${this.hostsKey}:${host}`, false);
  }

  public hosts(): Host[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    return this.listToHosts(hosts);
  }

  public list(): string[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    return hosts;
  }

  public add(host: string): Host[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    if (host === "") {
      return this.listToHosts(hosts);
    }
    if (hosts.includes(host)) {
      let msg = `Host you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return this.listToHosts(hosts);
    }
    hosts.push(host);
    this.memento.update(this.hostsKey, hosts);
    return this.listToHosts(hosts);
  }

  public remove(host: string): Host[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    let idx = hosts.indexOf(host);
    if (idx !== -1) {
      hosts.splice(idx, 1);
    }
    this.memento.update(this.hostsKey, hosts);
    return this.listToHosts(hosts);
  }

  public getCurret(): string {
    return this.memento.get<string>(this.currentHostKey, ``);
  }

  public setCurret(host: string): Host[] {
    let previous = this.getCurret();
    this.memento.update(`${this.hostsKey}:${previous}`, false);
    this.memento.update(this.currentHostKey, host);
    this.memento.update(`${this.hostsKey}:${host}`, true);
    return this.hosts();
  }
}
