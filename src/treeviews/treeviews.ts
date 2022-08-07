import * as vscode from "vscode";
import { HeadersTreeView } from "./headers";
import { ProtoFilesView } from "./protos";
import { HistoryTreeView } from "./history";
import { Message } from "../grpcurl/parser";
import { Header } from "../storage/headers";
import { RequestHistoryData } from "../storage/history";
import { ProtoFile } from "../grpcurl/grpcurl";

export class TreeViews {
  public readonly headers: HeadersTreeView;
  public readonly files: ProtoFilesView;
  public readonly history: HistoryTreeView;
  constructor(input: {
    headers: Header[];
    requests: RequestHistoryData[];
    files: ProtoFile[];
    describeFileMsg: (path: string, tag: string) => Promise<Message>;
  }) {
    this.headers = new HeadersTreeView(input.headers);
    this.history = new HistoryTreeView(input.requests);
    this.files = new ProtoFilesView(input.files, input.describeFileMsg);

    vscode.window.registerTreeDataProvider("files", this.files);
    vscode.window.registerTreeDataProvider("headers", this.headers);
    vscode.window.registerTreeDataProvider("history", this.history);
  }
}
