// import * as vscode from "vscode";
// import { ProtoServer } from "../grpcurl/grpcurl";
// import { ClickerItem } from "./items";

// export class HostsTreeView implements vscode.TreeDataProvider<ClickerItem> {
//   constructor(private hosts: ProtoServer[]) {
//     this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
//     this.onDidChangeTreeData = this.onChange.event;
//   }

//   private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
//   readonly onDidChangeTreeData: vscode.Event<
//     void | ClickerItem | ClickerItem[]
//   >;

//   update(hosts: ProtoServer[]): void {
//     this.hosts = hosts;
//     this.onChange.fire();
//   }

//   getTreeItem(element: ClickerItem): vscode.TreeItem {
//     return element;
//   }

//   getChildren(element?: ClickerItem): vscode.ProviderResult<ClickerItem[]> {
//     let hostItems: ClickerItem[] = [];
//     for (var host of this.hosts) {
//       hostItems.push(new ClickerItem(host));
//     }
//     return hostItems;
//   }

//   getParent?(element: ClickerItem): vscode.ProviderResult<ClickerItem> {
//     throw new Error("Method not implemented.");
//   }

//   resolveTreeItem?(
//     item: vscode.TreeItem,
//     element: ClickerItem,
//     token: vscode.CancellationToken
//   ): vscode.ProviderResult<vscode.TreeItem> {
//     return element;
//   }
// }
