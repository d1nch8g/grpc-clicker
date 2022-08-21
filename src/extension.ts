import * as vscode from "vscode";
import { Caller, FileSource, ServerSource } from "./grpcurl/caller";
import { Message, Parser } from "./grpcurl/parser";
import { Storage } from "./storage/storage";
import { TreeViews } from "./treeviews/treeviews";
import { WebViewFactory } from "./webview";
import { Grpcurl } from "./grpcurl/grpcurl";
import { CollectionItem, HeaderItem, TestItem } from "./treeviews/items";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalState);

  const grpcurl = new Grpcurl(
    new Parser(),
    new Caller(),
    vscode.workspace.getConfiguration(`grpc-clicker`).get(`usedocker`, false)
  );

  const treeviews = new TreeViews({
    files: storage.files.list(),
    historyValues: storage.history.list(),
    servers: storage.servers.list(),
    collections: storage.collections.list(),
    describeMsg: async (source, tag): Promise<Message> => {
      const msg = await grpcurl.message({
        source: source,
        messageTag: tag,
      });
      if (typeof msg === `string`) {
        vscode.window.showErrorMessage(msg);
      }
      return msg as Message;
    },
  });

  const webview = new WebViewFactory({
    uri: context.extensionUri,
    sendRequest: async (request) => {
      const response = await grpcurl.send(request);
      storage.history.add({ request, response });
      treeviews.history.refresh(storage.history.list());
      return response;
    },
    copyCliCommand: async (request) => {
      const cmd = await grpcurl.formCall(request);
      vscode.env.clipboard.writeText(cmd);
      vscode.window.showInformationMessage(
        `gRPCurl command successfully copied to clipboard!`
      );
    },
    createTest: async (request, expectations) => {
      if (expectations === undefined) {
        vscode.window.showErrorMessage(
          `unable to create test without parameters`
        );
        return;
      }
      const collections = storage.collections.list();
      let picks: string[] = [];
      for (const coll of collections) {
        picks.push(coll.name);
      }
      const collecitonName = await vscode.window.showQuickPick(picks);
      if (collecitonName === undefined) {
        return;
      }
      storage.collections.addTest(collecitonName, {
        request: request,
        expectations: expectations,
        result: undefined,
      });
    },
  });

  vscode.commands.registerCommand("cache.clean", async () => {
    storage.clean();
    treeviews.files.refresh([]);
    treeviews.servers.refresh([]);
    treeviews.history.refresh([]);
    treeviews.collections.refresh([]);
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
    const importPath = await vscode.window.showInputBox({
      value: `/`,
      title: `Specify import path for imports.`,
    });
    if (importPath === undefined || importPath === ``) {
      return;
    }
    const path = choice[0].fsPath;
    const protoSource: FileSource = {
      type: "FILE",
      filePath: path,
      importPath: importPath,
    };
    const proto = await grpcurl.proto(protoSource);
    if (typeof proto === `string`) {
      vscode.window.showErrorMessage(proto);
      return;
    }
    const err = storage.files.add({
      type: "PROTO",
      source: protoSource,
      services: proto.services,
    });
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
    const serverSource: ServerSource = {
      type: "SERVER",
      host: host,
      usePlaintext: plaintext === `Yes`,
    };
    const proto = await grpcurl.proto(serverSource);
    if (typeof proto === `string`) {
      vscode.window.showErrorMessage(proto);
      return;
    }
    const err = storage.servers.add({
      type: "PROTO",
      source: serverSource,
      services: proto.services,
    });
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
    for (const oldFile of olfFiles) {
      const newProto = await grpcurl.proto({
        path: oldFile.path,
        importPath: oldFile.importPath,
        hosts: oldFile.hosts,
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

  vscode.commands.registerCommand("webview.open", async (data: RequestData) => {
    data.maxMsgSize = vscode.workspace
      .getConfiguration(`grpc-clicker`)
      .get(`msgsize`, 4);

    for (const header of storage.headers.list()) {
      if (header.active) {
        data.headers.push(header.value);
      }
    }
    let msg: Message | string;
    if (data.path !== ``) {
      msg = await grpcurl.message({
        source: data.path,
        server: false,
        plaintext: false,
        tag: data.inputMessageTag,
        importPath: data.importPath,
      });
    } else {
      msg = await grpcurl.message({
        source: data.server.adress,
        server: true,
        plaintext: data.server.plaintext,
        tag: data.inputMessageTag,
        importPath: ``,
      });
    }

    if (typeof msg === `string`) {
      vscode.window.showErrorMessage(msg);
      return;
    }
    data.json = msg.template!;
    webview.createNewTab(data);
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

  vscode.commands.registerCommand("collections.create", async () => {
    const collectionName = await vscode.window.showInputBox({
      title: `Name for new collection`,
    });
    if (collectionName === "" || collectionName === undefined) {
      return;
    }
    storage.collections.addCollection({
      name: collectionName,
      tests: [],
    });
    let list = storage.collections.list();
    treeviews.collections.refresh(list);
  });

  vscode.commands.registerCommand(
    "colections.run",
    async (col: CollectionItem) => {
      for (const test of col.base.tests) {
        test.passed = undefined;
      }
      storage.collections.updateCollection(col.base);
      treeviews.collections.refresh(storage.collections.list());
      for (let test of col.base.tests) {
        test = await grpcurl.test(test);
        storage.collections.updateCollection(col.base);
        treeviews.collections.refresh(storage.collections.list());
      }
    }
  );

  vscode.commands.registerCommand(
    "colections.remove",
    async (col: CollectionItem) => {
      storage.collections.removeCollection(col.base.name);
      treeviews.collections.refresh(storage.collections.list());
    }
  );

  vscode.commands.registerCommand("tests.remove", async (test: TestItem) => {
    const collection = test.parent.base;
    const testString = JSON.stringify(test.base);
    collection.tests.forEach((test, idx) => {
      if (JSON.stringify(test) === testString) {
        collection.tests.splice(idx, 1);
      }
    });
    storage.collections.updateCollection(collection);
    treeviews.collections.refresh(storage.collections.list());
  });

  vscode.commands.registerCommand("files.import", async (file: FileItem) => {
    const importPath = await vscode.window.showInputBox({
      value: `/`,
      title: `Specify import path for imports.`,
    });
    if (importPath === undefined || importPath === ``) {
      return;
    }
    file.base.importPath = importPath;
    storage.files.updateImportPath(file.base.path, importPath);
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
