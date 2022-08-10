import * as vscode from "vscode";
import { Caller } from "./grpcurl/caller";
import { Grpcurl, ProtoFile, ProtoServer } from "./grpcurl/grpcurl";
import { Message, Parser, Proto, ProtoType } from "./grpcurl/parser";
import { Storage } from "./storage/storage";
import {
  FileItem,
  HeaderItem,
  HostItem,
  HostsItem,
  RequestData,
  ServerItem,
} from "./treeviews/items";
import { TreeViews } from "./treeviews/treeviews";
import { WebViewFactory } from "./webview";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalState);

  const grpcurl = new Grpcurl(
    new Parser(),
    new Caller(),
    vscode.workspace.getConfiguration(`grpc-clicker`).get(`usedocker`, false)
  );

  const treeviews = new TreeViews({
    files: storage.files.list(),
    headers: storage.headers.list(),
    requests: storage.history.list(),
    servers: storage.servers.list(),
    describeFileMsg: async (path: string, tag: string): Promise<Message> => {
      const msg = await grpcurl.message({
        source: path,
        server: false,
        plaintext: false,
        tag: tag,
      });
      if (typeof msg === `string`) {
        vscode.window.showErrorMessage(msg);
      }
      return msg as Message;
    },
    describeServerMsg: async (
      host: string,
      plaintext: boolean,
      tag: string
    ): Promise<Message> => {
      const msg = await grpcurl.message({
        source: host,
        server: true,
        tag: tag,
        plaintext: plaintext,
      });
      if (typeof msg === `string`) {
        vscode.window.showErrorMessage(msg);
      }
      return msg as Message;
    },
  });

  vscode.commands.registerCommand("cache.clean", async () => {
    storage.clean();
    treeviews.files.refresh([]);
    treeviews.headers.refresh([]);
    treeviews.servers.refresh([]);
    treeviews.history.refresh([]);
  });

  vscode.commands.registerCommand("files.add", async () => {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        protoFiles: ["proto"],
      },
      title: `Path to proto file in file system`,
    };
    const choice = await vscode.window.showOpenDialog(options);
    if (choice === undefined) {
      return;
    }
    const defaultHost = await vscode.window.showInputBox({
      title: `default host for calls`,
    });
    if (defaultHost === undefined || defaultHost === ``) {
      return;
    }
    const plaintext = await vscode.window.showQuickPick([`Yes`, `No`], {
      title: `Use plain text? (for servers without TLS)`,
    });
    if (plaintext === undefined || plaintext === ``) {
      return;
    }
    const path = choice[0].fsPath;
    let proto = await grpcurl.protoFile({
      path: path,
      hosts: [{ adress: defaultHost, plaintext: plaintext === `Yes` }],
    });
    if (typeof proto === `string`) {
      vscode.window.showErrorMessage(proto);
      return;
    }
    const err = storage.files.add(proto);
    if (err !== undefined) {
      vscode.window.showErrorMessage(err.message);
      return;
    }
    treeviews.files.refresh(storage.files.list());
  });

  vscode.commands.registerCommand(`servers.add`, async () => {
    const host = await vscode.window.showInputBox({
      title: `proto reflect server for calls`,
    });
    if (host === undefined || host === ``) {
      return;
    }
    const plaintext = await vscode.window.showQuickPick([`Yes`, `No`], {
      title: `Use plain text? (for servers without TLS)`,
    });
    if (plaintext === undefined || plaintext === ``) {
      return;
    }
    let proto = await grpcurl.protoServer({
      host: host,
      plaintext: plaintext === `Yes`,
    });
    if (typeof proto === `string`) {
      vscode.window.showErrorMessage(proto);
      return;
    }
    const err = storage.servers.add(proto);
    if (err !== undefined) {
      vscode.window.showErrorMessage(err.message);
      return;
    }
    treeviews.servers.refresh(storage.servers.list());
  });

  vscode.commands.registerCommand("files.remove", (item: FileItem) => {
    storage.files.remove(item.base.path);
    treeviews.files.refresh(storage.files.list());
  });

  vscode.commands.registerCommand("servers.remove", (item: ServerItem) => {
    storage.servers.remove(item.base.adress);
    treeviews.servers.refresh(storage.servers.list());
  });

  vscode.commands.registerCommand("files.refresh", async () => {
    const olfFiles = storage.files.list();
    let newFiles: ProtoFile[] = [];
    for (const olfFile of olfFiles) {
      const newProto = await grpcurl.protoFile({
        path: olfFile.path,
        hosts: olfFile.hosts,
      });
      if (typeof newProto === `string`) {
        vscode.window.showErrorMessage(newProto);
      } else {
        newFiles.push(newProto);
      }
    }
    storage.files.save(newFiles);
    treeviews.files.refresh(newFiles);
  });

  vscode.commands.registerCommand("servers.refresh", async () => {
    const oldServers = storage.servers.list();
    let newServers: ProtoServer[] = [];
    for (const oldServer of oldServers) {
      const newProto = await grpcurl.protoServer({
        host: oldServer.adress,
        plaintext: true,
      });
      if (typeof newProto === `string`) {
        vscode.window.showErrorMessage(newProto);
        newServers.push({
          adress: oldServer.adress,
          plaintext: true,
          type: ProtoType.proto,
          services: [],
        });
      } else {
        newServers.push(newProto);
      }
    }
    storage.servers.save(newServers);
    treeviews.servers.refresh(newServers);
  });

  vscode.commands.registerCommand("headers.add", async () => {
    const header = await vscode.window.showInputBox({
      title: `header that you can add to gRPC call, in format: "key: value", enable/disable by clicking`,
    });
    if (header === "" || header === undefined) {
      return;
    }
    const err = storage.headers.add({
      value: header,
      active: false,
    });
    if (err !== undefined) {
      vscode.window.showErrorMessage(err.message);
    }
    treeviews.headers.refresh(storage.headers.list());
  });

  vscode.commands.registerCommand(
    "headers.remove",
    async (header: HeaderItem) => {
      storage.headers.remove(header.header.value);
      treeviews.headers.refresh(storage.headers.list());
    }
  );

  vscode.commands.registerCommand("headers.switch", async (header: string) => {
    let headers = storage.headers.list();
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].value === header) {
        headers[i].active = !headers[i].active;
      }
    }
    storage.headers.save(headers);
    treeviews.headers.refresh(storage.headers.list());
  });

  const webviewFactory = new WebViewFactory(
    context.extensionUri,
    async (request) => {
      let metadata: string[] = [];
      const headers = storage.headers.list();
      for (const header of headers) {
        if (header.active) {
          metadata.push(header.value);
        }
      }
      const resp = await grpcurl.send(request);
      request.code = resp.code;
      request.response = resp.response;
      request.time = resp.time;
      request.date = resp.date;
      storage.history.add(request);
      treeviews.history.refresh(storage.history.list());
      return request;
    },
    (request: RequestData) => {
      const command = grpcurl.formCall(request);
      vscode.env.clipboard.writeText(command);
      vscode.window.showInformationMessage(
        `gRPCurl command have been copied to clipboard`
      );
    }
  );

  vscode.commands.registerCommand("webview.open", async (data: RequestData) => {
    data.maxMsgSize = vscode.workspace
      .getConfiguration(`grpc-clicker`)
      .get(`msgsize`, 4);

    for (const header of storage.headers.list()) {
      if (header.active) {
        data.metadata.push(header.value);
      }
    }
    let msg: Message | string;
    if (data.path !== ``) {
      msg = await grpcurl.message({
        source: data.path,
        server: false,
        plaintext: false,
        tag: data.inputMessageTag,
      });
    } else {
      msg = await grpcurl.message({
        source: data.host.adress,
        server: true,
        plaintext: data.host.plaintext,
        tag: data.inputMessageTag,
      });
    }

    if (typeof msg === `string`) {
      vscode.window.showErrorMessage(msg);
      return;
    }
    data.json = msg.template!;
    webviewFactory.create(data);
  });

  vscode.commands.registerCommand("history.clean", () => {
    storage.history.clean();
    treeviews.history.refresh(storage.history.list());
  });

  vscode.commands.registerCommand("hosts.add", async (host: HostsItem) => {
    const newHost = await vscode.window.showInputBox({
      title: `host for calls`,
    });
    if (newHost === undefined || newHost === ``) {
      return;
    }
    const plaintext = await vscode.window.showQuickPick([`Yes`, `No`], {
      title: `Use plain text? (for servers without TLS)`,
    });
    if (plaintext === undefined || plaintext === ``) {
      return;
    }
    storage.files.addHost(host.parent.base.path, {
      adress: newHost,
      plaintext: plaintext === `Yes`,
    });
    treeviews.files.refresh(storage.files.list());
  });

  vscode.commands.registerCommand("hosts.remove", (host: HostItem) => {
    storage.files.removeHost(host.parent.parent.base.path, host.host);
    treeviews.files.refresh(storage.files.list());
  });

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(`grpc-clicker.usedocker`)) {
      grpcurl.useDocker = vscode.workspace
        .getConfiguration(`grpc-clicker`)
        .get(`usedocker`, false);
    }
  });
}

export function deactivate() {}
