import * as vscode from "vscode";
import { Memento } from "vscode";

export class Hosts {
  private hostsKey: string;
  private currentHostKey: string;
  constructor(private memento: Memento) {
    this.hostsKey = "grpc-clicker-hosts";
    this.currentHostKey = "grpc-clicker-curHost";
  }

  public list(): string[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    return hosts;
  }

  public add(host: string): string[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    if (host === "") {
      return hosts;
    }
    if (hosts.includes(host)) {
      let msg = `Host you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return hosts;
    }
    hosts.push(host);
    this.memento.update(this.hostsKey, hosts);
    return hosts;
  }

  public remove(host: string): string[] {
    let hosts = this.memento.get<string[]>(this.hostsKey, []);
    let idx = hosts.indexOf(host);
    if (idx !== -1) {
      hosts.splice(idx, 1);
    }
    this.memento.update(this.hostsKey, hosts);
    return hosts;
  }

  public getCurret(): string {
    return this.memento.get<string>(this.currentHostKey, ``);
  }

  public setCurret(host: string) {
    this.memento.update(this.currentHostKey, host);
  }
}
