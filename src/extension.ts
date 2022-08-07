import * as vscode from "vscode";
import { Caller } from "./grpcurl/caller";
import { Grpcurl } from "./grpcurl/grpcurl";
import { Message, Parser, Proto } from "./grpcurl/parser";
import { Storage } from "./storage/storage";
import { RequestData } from "./treeviews/protos";
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
    hosts: storage.hosts.list(),
    headers: storage.headers.list(),
    requests: storage.history.list(),
    protos: storage.protos.list(),
    describeMsg: async (path: string, tag: string): Promise<Message> => {
      const msg = await grpcurl.message(path, tag);
      if (msg.error !== undefined) {
        vscode.window.showErrorMessage(msg.error);
      }
      return msg;
    },
  });

  vscode.commands.registerCommand("cache.clean", async () => {
    storage.clean();
    treeviews.headers.refresh([]);
    treeviews.protos.refresh([]);
    treeviews.headers.refresh([]);
    treeviews.history.refresh([]);
  });

  vscode.commands.registerCommand("hosts.add", async () => {
    const host = await vscode.window.showInputBox({
      title: `adress to make a call`,
    });
    if (host === "" || host === undefined) {
      return;
    }
    const description = await vscode.window.showInputBox({
      title: `description for spectiifed host`,
    });
    let err = storage.hosts.add({
      adress: host,
      description: description,
      current: false,
    });
    if (err !== undefined) {
      vscode.window.showErrorMessage(err.message);
    }
    treeviews.hosts.update(storage.hosts.list());
  });

  vscode.commands.registerCommand("hosts.remove", async () => {
    const hosts = storage.hosts.list();
    let adresses: string[] = [];
    for (const host of hosts) {
      adresses.push(host.adress);
    }
    const removeHost = await vscode.window.showQuickPick(adresses, {
      title: `choose a host to remove`,
    });
    if (
      removeHost === "" ||
      removeHost === undefined ||
      removeHost === undefined
    ) {
      return;
    }
    storage.hosts.remove(removeHost);
    treeviews.hosts.update(storage.hosts.list());
  });

  vscode.commands.registerCommand("hosts.switch", async (adress: string) => {
    let hosts = storage.hosts.list();
    for (var i = 0; i < hosts.length; i++) {
      hosts[i].current = false;
      if (hosts[i].adress === adress) {
        hosts[i].current = true;
      }
    }
    storage.hosts.save(hosts);
    treeviews.hosts.update(hosts);
  });

  vscode.commands.registerCommand("protos.add", async () => {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        protoFiles: ["proto"],
      },
    };
    const choice = await vscode.window.showOpenDialog(options);
    if (choice === undefined) {
      return;
    }
    const path = choice[0].fsPath;
    let proto = await grpcurl.proto(path);
    if (proto.error !== undefined) {
      vscode.window.showErrorMessage(proto.error);
      return;
    }
    const err = storage.protos.add(proto);
    if (err !== undefined) {
      vscode.window.showErrorMessage(err.message);
      return;
    }
    treeviews.protos.refresh(storage.protos.list());
  });

  vscode.commands.registerCommand("protos.remove", async () => {
    let protos = storage.protos.list();
    let pathes: string[] = [];
    for (const proto of protos) {
      pathes.push(proto.path);
    }
    let path = await vscode.window.showQuickPick(pathes);
    if (path === undefined) {
      return;
    }
    storage.protos.remove(path);
    treeviews.protos.refresh(storage.protos.list());
  });

  vscode.commands.registerCommand("protos.refresh", async () => {
    const oldProtos = storage.protos.list();
    let newProtos: Proto[] = [];
    for (const oldProto of oldProtos) {
      const newProto = await grpcurl.proto(oldProto.path);
      if (newProto.error !== undefined) {
        vscode.window.showErrorMessage(newProto.error);
      } else {
        newProtos.push(newProto);
      }
    }
    storage.protos.save(newProtos);
    treeviews.protos.refresh(newProtos);
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

  vscode.commands.registerCommand("headers.remove", async () => {
    let headerValues: string[] = [];
    for (const header of storage.headers.list()) {
      headerValues.push(header.value);
    }
    const header = await vscode.window.showQuickPick(headerValues);
    if (header === undefined) {
      return;
    }
    storage.headers.remove(header);
    treeviews.headers.refresh(storage.headers.list());
  });

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
    async (data) => {
      let metadata: string[] = [];
      const headers = storage.headers.list();
      for (const header of headers) {
        if (header.active) {
          metadata.push(header.value);
        }
      }
      const resp = await grpcurl.send({
        path: data.path,
        reqJson: data.reqJson,
        host: data.host,
        call: `${data.protoName}.${data.service}.${data.call}`,
        plaintext: data.plaintext,
        metadata: metadata,
        maxMsgSize: data.maxMsgSize,
      });
      data.code = resp.code;
      data.respJson = resp.respJson;
      data.time = resp.time;
      data.date = resp.date;
      data.errmes = resp.errmes;
      storage.history.add(data);
      treeviews.history.refresh(storage.history.list());
      return data;
    },
    (request: RequestData) => {
      // TODO add formimg of grpcurl command
    }
  );

  vscode.commands.registerCommand("webview.open", async (data: RequestData) => {
    // TODO process later on
    data.plaintext = vscode.workspace
      .getConfiguration(`grpc-clicker`)
      .get(`plaintext`, true);
    data.maxMsgSize = vscode.workspace
      .getConfiguration(`grpc-clicker`)
      .get(`msgsize`, 4);

    for (const host of storage.hosts.list()) {
      data.hosts.push(host.adress);
      if (host.current) {
        data.host = host.adress;
      }
    }
    for (const header of storage.headers.list()) {
      if (header.active) {
        data.metadata.push(header.value);
      }
    }
    const msg = await grpcurl.message(data.path, data.inputMessageTag);
    if (msg.error !== undefined) {
      vscode.window.showErrorMessage(msg.error);
      return;
    }
    data.reqJson = msg.template!;
    webviewFactory.create(data);
  });

  vscode.commands.registerCommand("history.clean", () => {
    storage.history.clean();
    treeviews.history.refresh(storage.history.list());
  });

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(`grpc-clicker.usedocker`)) {
      grpcurl.useDocker = vscode.workspace
        .getConfiguration(`grpc-clicker`)
        .get(`usedocker`, false);
    }
  });

  if (storage.showInstallError()) {
    grpcurl.checkInstalled().then((installed) => {
      if (!installed) {
        vscode.window.showErrorMessage(
          `gRPCurl is not installed. You can switch to docker version in extension settings.`
        );
      }
    });
  }
}

export function deactivate() {}
