import * as vscode from "vscode";
import { ProtoFilesView } from "./files";
import { HistoryTreeView } from "./history";
import { Message } from "../grpcurl/parser";
import { ServerTreeView } from "./servers";
import { CollectionsTreeView } from "./collections";
import { Collection } from "../storage/collections";
import { ProtoFile } from "../storage/protoFiles";
import { ProtoServer } from "../storage/protoServer";
import { HistoryValue } from "../storage/history";
import { FileSource, ServerSource } from "../grpcurl/caller";

/**
 * Entity representing proto schema and server source
 */
export interface ProtosTreeViewParams {
  historyValues: HistoryValue[];
  files: ProtoFile[];
  servers: ProtoServer[];
  collections: Collection[];
  /**
   * Callback that can be used for message description.
   */
  describeMsg: (
    /**
     * Path to proto file
     */
    source: ServerSource | FileSource,
    /**
     * Message tag in `grpcurl` compatible format.
     */
    tag: string
  ) => Promise<Message>;
}

export class TreeViews {
  public readonly files: ProtoFilesView;
  public readonly servers: ServerTreeView;
  public readonly history: HistoryTreeView;
  public readonly collections: CollectionsTreeView;
  constructor(params: ProtosTreeViewParams) {
    this.files = new ProtoFilesView(params.files, params.describeMsg);
    this.servers = new ServerTreeView(params.servers, params.describeMsg);
    this.history = new HistoryTreeView(params.historyValues);
    this.collections = new CollectionsTreeView(params.collections);

    vscode.window.registerTreeDataProvider("files", this.files);
    vscode.window.registerTreeDataProvider("servers", this.servers);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("collections", this.collections);
  }
}
