import * as vscode from "vscode";
import { HostsTreeView } from "./hosts";
import { HeadersTreeView } from "./headers";
import { ProtosTreeView } from "./protos";
import { HistoryTreeView } from "./history";
import { Proto } from "../grpcurl/parser";
import { Host } from "../storage/hosts";
import { Header } from "../storage/headers";
import { RequestHistoryData } from "../storage/history";

export class TreeViews {
  public readonly hosts: HostsTreeView;
  public readonly headers: HeadersTreeView;
  public readonly protos: ProtosTreeView;
  public readonly history: HistoryTreeView;
  constructor(input: {
    hosts: Host[];
    headers: Header[];
    requests: RequestHistoryData[];
    protos: Proto[];
  }) {
    this.hosts = new HostsTreeView(input.hosts);
    this.headers = new HeadersTreeView(input.headers);
    this.history = new HistoryTreeView(input.requests);
    this.protos = new ProtosTreeView(input.protos);

    vscode.window.registerTreeDataProvider("hosts", this.hosts);
    vscode.window.registerTreeDataProvider("headers", this.headers);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("protos", this.protos);
  }
}
