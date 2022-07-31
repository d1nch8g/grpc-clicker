import * as vscode from "vscode";
import { HostsTreeView } from "./hosts";
import { HeadersTreeView } from "./metadata";
import { ProtosTreeView } from "./protos";
import { HistoryTreeView } from "./history";
import { Host } from "../classes/host";
import { Meta } from "../classes/meta";
import { Request } from "../classes/request";
import { Grpcurl } from "../grpcurl/grpcurl";

export class TreeViews {
  public readonly hosts: HostsTreeView;
  public readonly metadata: HeadersTreeView;
  public readonly protos: ProtosTreeView;
  public readonly history: HistoryTreeView;
  constructor(
    hosts: Host[],
    meta: Meta[],
    requests: Request[],
    protos: string[],
    grpcurl: Grpcurl
  ) {
    this.hosts = new HostsTreeView(hosts);
    this.metadata = new HeadersTreeView(meta);
    this.history = new HistoryTreeView(requests);
    this.protos = new ProtosTreeView(grpcurl, protos);

    vscode.window.registerTreeDataProvider("hosts", this.hosts);
    vscode.window.registerTreeDataProvider("metas", this.metadata);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("protos", this.protos);
  }
}
