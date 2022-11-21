import * as vscode from "vscode";
import { HistoryTreeView } from "./history";
import { Message } from "../grpcurl/parser";
import { ServerTreeView } from "./protos";
import { CollectionsTreeView } from "./collections";
import { Collection } from "../storage/collections";
import { HistoryValue } from "../storage/history";
import { ProtoSource } from "../grpcurl/caller";

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
    source: ProtoSource,
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

    vscode.window.registerTreeDataProvider("protos", this.servers);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("collections", this.collections);
  }
}
