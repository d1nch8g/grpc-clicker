import * as vscode from "vscode";
import { HeadersTreeView } from "./headers";
import { ProtoFilesView } from "./files";
import { HistoryTreeView } from "./history";
import { Message } from "../grpcurl/parser";
import { Header } from "../storage/headers";
import { ProtoFile, ProtoServer, RequestData } from "../grpcurl/grpcurl";
import { ServerTreeView } from "./servers";
import { CollectionsTreeView } from "./collections";
import { Collection } from "../storage/collections";

export class TreeViews {
  public readonly files: ProtoFilesView;
  public readonly servers: ServerTreeView;
  public readonly headers: HeadersTreeView;
  public readonly history: HistoryTreeView;
  public readonly collections: CollectionsTreeView;
  constructor(input: {
    headers: Header[];
    requests: RequestData[];
    files: ProtoFile[];
    servers: ProtoServer[];
    collections: Collection[];
    describeFileMsg: (
      path: string,
      importPath: string,
      tag: string
    ) => Promise<Message>;
    describeServerMsg: (
      path: string,
      plaintext: boolean,
      tag: string
    ) => Promise<Message>;
  }) {
    this.files = new ProtoFilesView(input.files, input.describeFileMsg);
    this.servers = new ServerTreeView(input.servers, input.describeServerMsg);
    this.headers = new HeadersTreeView(input.headers);
    this.history = new HistoryTreeView(input.requests);
    this.collections = new CollectionsTreeView(input.collections);

    vscode.window.registerTreeDataProvider("files", this.files);
    vscode.window.registerTreeDataProvider("servers", this.servers);
    vscode.window.registerTreeDataProvider("headers", this.headers);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("collections", this.collections);
  }
}
