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
  public readonly metadata: HeadersTreeView;
  public readonly protos: ProtosTreeView;
  public readonly history: HistoryTreeView;
  constructor(
    hosts: Host[],
    meta: Header[],
    requests: RequestHistoryData[],
    protos: Proto[]
  ) {
    this.hosts = new HostsTreeView(hosts);
    this.metadata = new HeadersTreeView(meta);
    this.history = new HistoryTreeView(requests);
    this.protos = new ProtosTreeView(protos);

    vscode.window.registerTreeDataProvider("hosts", this.hosts);
    vscode.window.registerTreeDataProvider("metas", this.metadata);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("protos", this.protos);
  }
}
