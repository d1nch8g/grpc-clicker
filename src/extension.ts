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
  const grpcurl = new Grpcurl(new Parser(), new Caller());
  const treeviews = new TreeViews({
    hosts: storage.hosts.list(),
    headers: storage.headers.list(),
    requests: storage.history.list(),
    protos: storage.protos.list(),
    describeMsg: async (path: string, tag: string): Promise<Message> => {
      const [msg, err] = await grpcurl.message(path, tag);
      if (err !== null) {
        vscode.window.showErrorMessage(err.message);
      }
      return msg;
    },
  });

  vscode.commands.registerCommand("hosts.add", async () => {
    const host = await vscode.window.showInputBox({
      title: `adress to make a call`,
    });
    if (host === "" || host === undefined || host === null) {
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
    if (err !== null) {
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
    if (removeHost === "" || removeHost === undefined || removeHost === null) {
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
    const path = (await vscode.window.showOpenDialog(options))[0].fsPath;
    let [proto, err] = await grpcurl.proto(path);
    if (err !== null) {
      vscode.window.showErrorMessage(err.message);
    }
    err = storage.protos.add(proto);
    if (err !== null) {
      vscode.window.showErrorMessage(err.message);
    }
    treeviews.protos.update(storage.protos.list());
  });

  vscode.commands.registerCommand("protos.remove", async () => {
    let protos = storage.protos.list();
    let pathes: string[] = [];
    for (const proto of protos) {
      pathes.push(proto.path);
    }
    let path = await vscode.window.showQuickPick(pathes);
    storage.protos.remove(path);
    treeviews.protos.update(storage.protos.list());
  });

  vscode.commands.registerCommand("protos.refresh", async () => {
    const oldProtos = storage.protos.list();
    let newProtos: Proto[] = [];
    for (const oldProto of oldProtos) {
      const [newProto, err] = await grpcurl.proto(oldProto.path);
      if (err !== null) {
        vscode.window.showErrorMessage(err.message);
      } else {
        newProtos.push(newProto);
      }
    }
    storage.protos.save(newProtos);
    treeviews.protos.update(newProtos);
  });

  vscode.commands.registerCommand("headers.add", async () => {
    const header = await vscode.window.showInputBox({
      title: `header that you can add to gRPC call, in format: "key: value", enable/disable by clicking`,
    });
    if (header === "" || header === undefined || header === null) {
      return;
    }
    const err = storage.headers.add({
      value: header,
      active: false,
    });
    if (err !== null) {
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
    if (header === "" || header === undefined || header === null) {
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
      const resp = await grpcurl.send({
        path: data.path,
        reqJson: data.reqJson,
        host: data.host,
        call: `${data.protoName}.${data.service}.${data.call}`,
        tlsOn: data.tlsOn,
        metadata: data.metadata,
        maxMsgSize: data.maxMsgSize,
      });
      data.code = resp.code;
      data.respJson = resp.respJson;
      data.time = resp.time;
      data.date = resp.date;
      data.errmes = resp.errmes;
      storage.history.add(data);
      return data;
    }
  );

  vscode.commands.registerCommand("webview.open", async (data: RequestData) => {
    // TODO process later on
    data.tlsOn = false;
    data.maxMsgSize = null;

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
    const [msg, err] = await grpcurl.message(data.path, data.inputMessageTag);
    if (err !== null) {
      vscode.window.showErrorMessage(err.message);
      return;
    }
    data.reqJson = msg.template;
    webviewFactory.create(data);
  });
}

export function deactivate() {}
