import * as vscode from "vscode";
import * as fs from "fs";
import { Caller, ProtoSource } from "./grpcurl/caller";
import { Response, Expectations, Request, Proto } from "./grpcurl/grpcurl";
import { Message, Parser } from "./grpcurl/parser";
import { Storage } from "./storage/storage";
import { TreeViews } from "./treeviews/treeviews";
import { CallWebViewFactory } from "./webviews/call";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdditionalInfo, HistoryValue } from "./storage/history";
import { Installer } from "./grpcurl/installer";
import { SourceWebViewData, SourceWebViewFactory } from "./webviews/source";
import { v4 as uuidv4 } from "uuid";
import {
  CollectionItem,
  GrpcTabFromScratch,
  ProtoItem,
  TestItem,
} from "./treeviews/items";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalState);

  const grpcurl = new Grpcurl(
    new Parser(),
    new Caller(),
    new Installer(),
    context.extensionPath
  );

  const treeviews = new TreeViews({
    historyValues: storage.history.list(),
    protos: storage.protos.list(),
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

  async function openLink() {
    const open = require("open");
    const choice = await vscode.window.showInformationMessage(
      `Congratulations! You made thousand requests using gRPC Clicker. ` +
      `Github star would be highly appreciated.`,
      `Star on github`,
      `Open github issue`,
      `Skip`
    );
    switch (choice) {
      case `Star on github`:
        open(`https://github.com/Dancheg97/grpclicker_vscode`);
      case `Open github issue`:
        open(`https://github.com/Dancheg97/grpclicker_vscode/issues`);
    }
  }

  const callWebviewFactory = new CallWebViewFactory({
    uri: context.extensionUri,
    sendRequest: async (request, info) => {
      const resp = await grpcurl.send(request);
      const count = storage.history.add({ request, response: resp, info });
      if (count === 1000) {
        openLink();
      }
      treeviews.history.refresh(storage.history.list());
      return resp;
    },
    createSnippet: async (request) => {
      const call = grpcurl.formCall(request);
      const splittedCall = call.split(` `);
      splittedCall[0] = `grpcurl`;
      return splittedCall.join(` `).replace(`-emit-defaults  `, ``);
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
      treeviews.collections.refresh(storage.collections.list());
    },
    addHeader: async () => {
      const header = await vscode.window.showInputBox({
        title: `Add new header in grpcurl compatible format, example 'username: user'`,
      });
      if (header === undefined) {
        return storage.headers.list();
      }
      storage.headers.add({
        value: header,
        active: false,
      });
      return storage.headers.list();
    },
    removeHeader: async () => {
      let headersValues: string[] = [];
      for (const header of storage.headers.list()) {
        headersValues.push(header.value);
      }
      const choice = await vscode.window.showQuickPick(headersValues, {
        title: `Choose header to remove`,
      });
      if (choice === undefined) {
        return storage.headers.list();
      }
      storage.headers.save(
        storage.headers.list().filter((header) => header.value !== choice)
      );
      return storage.headers.list();
    },
  });

  const sourceWebviewFactory = new SourceWebViewFactory({
    uri: context.extensionUri,
    createViewCallback: async (source: SourceWebViewData) => {
      let group: string | undefined = undefined;
      if (source.group !== ``) {
        group = source.group;
      }
      const src: ProtoSource = {
        uuid: source.uuid,
        adress: source.adress,
        plaintext: source.plaintext,
        name: source.name,
        group: group,
        timeout: source.timeout,
        filePath: undefined,
        importPaths: []
      };
      if (source.useFile) {
        src.filePath = source.filePath;
        src.importPaths = source.importPaths.split(`,`);
      }
      const protoResult = await grpcurl.proto(src);
      if (typeof protoResult === `string`) {
        vscode.window.showErrorMessage(protoResult);
        return false;
      }
      const storageResult = storage.protos.add({
        source: src,
        schema: protoResult
      });
      if (storageResult !== undefined) {
        vscode.window.showErrorMessage(storageResult.message);
        return false;
      }
      treeviews.protos.refresh(storage.protos.list());
      return true;
    },
  });

  vscode.commands.registerCommand("cache.clean", async () => {
    storage.clean();
    treeviews.protos.refresh([]);
    treeviews.history.refresh([]);
    treeviews.collections.refresh([]);
  });

  vscode.commands.registerCommand(`protos.add`, async () => {
    const reflectTimeout = vscode.workspace
      .getConfiguration(`grpc-clicker`)
      .get(`reflectTimeout`, 0.5);
    const webviewParams: SourceWebViewData = {
      uuid: uuidv4(),
      timeout: reflectTimeout,
      plaintext: true,
      name: "",
      group: "",
      useFile: false,
      adress: "localhost:8080",
      filePath: "",
      importPaths: "/",
      connectStatus: `NOT_EXECUTED`,
      unix: false,
      customFlags: ""
    };
    sourceWebviewFactory.createNewTab(webviewParams);
  });

  vscode.commands.registerCommand("protos.remove", (item: ProtoItem) => {
    const source = item.proto.source as ProtoSource;
    storage.protos.remove(source.uuid);
    treeviews.protos.refresh(storage.servers.list());
  });

  vscode.commands.registerCommand("protos.refresh", async () => {
    const oldProtos = storage.protos.list();
    let newProtos: Proto[] = [];
    for (const proto of oldProtos) {
      const newProto = await grpcurl.proto(proto.source);
      if (typeof newProto === `string`) {
        vscode.window.showErrorMessage(newProto);
        proto.schema.services = [];
        newProtos.push(proto);
      } else {
        newProtos.push({
          source: proto.source,
          schema: newProto
        });
      }
    }
    storage.protos.save(newProtos);
    treeviews.protos.refresh(newProtos);
  });

  vscode.commands.registerCommand("history.clean", () => {
    storage.history.clean();
    treeviews.history.refresh(storage.history.list());
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

  vscode.commands.registerCommand("colections.run", async (col: CollectionItem) => {
    for (const test of col.base.tests) {
      test.result = undefined;
    }
    storage.collections.updateCollection(col.base);
    treeviews.collections.refresh(storage.collections.list());
    for (let test of col.base.tests) {
      test.result = await grpcurl.test(test.request, test.expectations);
      storage.collections.updateCollection(col.base);
      treeviews.collections.refresh(storage.collections.list());
    }
  }
  );

  vscode.commands.registerCommand("colections.remove", async (col: CollectionItem) => {
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

  vscode.commands.registerCommand(`history.open`, async (val: HistoryValue) => {
    const expectations: Expectations = {
      code: "OK",
      time: 0.1,
      content: ``,
    };

    const headers = storage.headers.list();
    for (const header of headers) {
      if (header.active) {
        val.request.headers.push(header.value);
      }
    }

    callWebviewFactory.createNewTab({
      request: val.request,
      info: val.info,
      headers: headers,
      response: val.response,
      expectations: expectations,
      snippet: ``,
    });
  });

  vscode.commands.registerCommand("webview.open", async (data: GrpcTabFromScratch) => {
    const maxMsgSize = vscode.workspace.getConfiguration(`grpc-clicker`).get(`msgsize`, 4);

    const msg = await grpcurl.message({
      source: data.proto.source,
      messageTag: data.call.inputMessageTag,
    });
    if (typeof msg === `string`) {
      vscode.window.showErrorMessage(msg);
      return;
    }

    let request: Request = {
      source: data.proto.source,
      content: msg.template!,
      callTag: `${data.service.tag}/${data.call.name}`,
      maxMsgSize: maxMsgSize,
      headers: []
    };

    const info: AdditionalInfo = {
      service: data.service.tag.split(`.`).pop()!,
      call: data.call.name,
      inputMessageTag: data.call.inputMessageTag,
      inputMessageName: msg.name,
      outputMessageName: data.call.outputMessageTag.split(`.`).pop()!,
      protoPackage: data.service.package,
    };

    const headers = storage.headers.list();
    for (const header of headers) {
      if (header.active) {
        request.headers.push(header.value);
      }
    }

    const respone: Response = {
      date: "",
      time: 0,
      code: "OK",
      content: "",
    };

    const expectations: Expectations = {
      code: "OK",
      time: 0.1,
      content: ``,
    };

    callWebviewFactory.createNewTab({
      request: request,
      info: info,
      headers: headers,
      response: respone,
      expectations: expectations,
      snippet: ``,
    });
  }
  );

  if (!fs.existsSync(context.extensionPath + `/dist/grpcurl/LICENSE`)) {
    installGrpcurl();
  }

  async function installGrpcurl() {
    vscode.window.showInformationMessage(`installing grpcurl`);
    const rez = await grpcurl.install(context.extensionPath + `/dist/grpcurl`);
    if (rez !== undefined) {
      vscode.window.showErrorMessage(rez);
      return;
    }
    vscode.window.showInformationMessage(`grpcurl installation complete`);
  }
}

export function deactivate() { }
