import * as vscode from "vscode";
import { HistoryTreeView } from "./history";
import { Message } from "../grpcurl/parser";
import { ServerTreeView } from "./protos";
import { CollectionsTreeView } from "./collections";
import { Collection } from "../storage/collections";
import { HistoryValue } from "../storage/history";
import { ProtoSource } from "../grpcurl/caller";
import { ProtoWithSource } from "./items";

/**
 * Entity representing proto schema and server source
 */
export interface ProtosTreeViewParams {
  historyValues: HistoryValue[];
  protos: ProtoWithSource[];
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
  public readonly servers: ServerTreeView;
  public readonly history: HistoryTreeView;
  public readonly collections: CollectionsTreeView;
  constructor(params: ProtosTreeViewParams) {
    this.servers = new ServerTreeView(params.protos, params.describeMsg);
    this.history = new HistoryTreeView(params.historyValues);
    this.collections = new CollectionsTreeView(params.collections);

    vscode.window.registerTreeDataProvider("protos", this.servers);
    vscode.window.registerTreeDataProvider("history", this.history);
    vscode.window.registerTreeDataProvider("collections", this.collections);
  }
}
