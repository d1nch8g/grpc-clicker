import * as vscode from "vscode";
import * as fs from "fs";
import { Caller, FileSource, ServerSource } from "./grpcurl/caller";
import { Response, Expectations, Request } from "./grpcurl/grpcurl";
import { Call, Message, Parser, Proto, Service } from "./grpcurl/parser";
import { Storage } from "./storage/storage";
import { TreeViews } from "./treeviews/treeviews";
import { WebViewFactory } from "./webviews/call";
import { Grpcurl } from "./grpcurl/grpcurl";
import { ProtoFile } from "./storage/protoFiles";
import { ProtoServer } from "./storage/protoServer";
import { AdditionalInfo, HistoryValue } from "./storage/history";
import { Installer } from "./grpcurl/installer";
import {
  CollectionItem,
  GrpcTabFromScratch as GrpcTabParams,
  HeaderItem,
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

  const webview = new WebViewFactory({
    uri: context.extensionUri,
    sendRequest: async (request, info) => {
      const response = await grpcurl.send(request);
      const count = storage.history.add({ request, response, info });
      if (count === 1000) {
        openLink();
      }
      treeviews.history.refresh(storage.history.list());
      return response;
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
    manageHosts: async () => {
      let storageHosts = storage.hosts.get();
      const choice = await vscode.window.showQuickPick([
        `Remove existing host`,
        `Add new host`,
        `Modify existing host`,
      ]);
      if (choice === undefined) {
        return storageHosts;
      }
      if (choice === `Add new host`) {
        const adress = await vscode.window.showInputBox({
          title: `Add new host for gRPC calls`,
          value: `localhost:8080`,
        });
        if (adress === undefined) {
          return storageHosts;
        }
        const pick = await vscode.window.showQuickPick([`Yes`, `No`], {
          title: `You plain text for calls?`,
        });
        storageHosts.push({
          adress: adress,
          plaintext: pick === `Yes`,
        });
        storage.hosts.save(storageHosts);
        return storageHosts;
      }
      let hosts: string[] = [];
      for (const host of storageHosts) {
        hosts.push(host.adress);
      }
      const host = await vscode.window.showQuickPick(hosts);
      if (host === undefined) {
        return storageHosts;
      }
      if (choice === `Remove existing host`) {
        storageHosts = storageHosts.filter(
          (filteredHost) => filteredHost.adress !== host
        );
        storage.hosts.save(storageHosts);
        return storageHosts;
      }
      if (choice === `Modify existing host`) {
        const newAdress = await vscode.window.showInputBox({
          title: `Modify adress`,
          value: host,
        });
        if (newAdress !== undefined) {
          storageHosts[hosts.indexOf(host)].adress = newAdress;
          storage.hosts.save(storageHosts);
        }
        const pick = await vscode.window.showQuickPick([`Yes`, `No`], {
          title: `You plain text for calls?`,
        });
        if (pick !== undefined) {
          storageHosts[hosts.indexOf(host)].plaintext = pick === `Yes`;
        }
      }
      storage.hosts.save(storageHosts);
      return storageHosts;
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
    const path = choice[0].fsPath.replaceAll(`\\`, `/`);
    const defaultImprt = path.substring(0, path.lastIndexOf(`/`));
    const importPath = await vscode.window.showInputBox({
      value: defaultImprt,
      title: `Specify import path for imports.`,
    });
    if (importPath === undefined || importPath === ``) {
      return;
    }
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
    const reflectTimeout = vscode.workspace
      .getConfiguration(`grpc-clicker`)
      .get(`reflectTimeout`, 0.5);

    const serverSource: ServerSource = {
      type: "SERVER",
      host: host,
      plaintext: plaintext === `Yes`,
      timeout: reflectTimeout,
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

  vscode.commands.registerCommand("files.remove", (item: ProtoItem) => {
    const source = item.proto.source as FileSource;
    storage.files.remove(source.filePath);
    treeviews.files.refresh(storage.files.list());
  });

  vscode.commands.registerCommand("servers.remove", (item: ProtoItem) => {
    const source = item.proto.source as ServerSource;
    storage.servers.remove(source.host);
    treeviews.servers.refresh(storage.servers.list());
  });

  vscode.commands.registerCommand("files.refresh", async () => {
    const oldProtos = storage.files.list();
    let newFiles: ProtoFile[] = [];
    for (const oldProto of oldProtos) {
      const newProto = await grpcurl.proto(oldProto.source);
      if (typeof newProto === `string`) {
        vscode.window.showErrorMessage(newProto);
      } else {
        newFiles.push({
          type: "PROTO",
          source: oldProto.source,
          services: newProto.services,
        });
      }
    }
    storage.files.save(newFiles);
    treeviews.files.refresh(newFiles);
  });

  vscode.commands.registerCommand("servers.refresh", async () => {
    const oldServers = storage.servers.list();
    let newServers: ProtoServer[] = [];
    for (const oldServer of oldServers) {
      const newProto = await grpcurl.proto(oldServer.source);
      if (typeof newProto === `string`) {
        vscode.window.showErrorMessage(newProto);
        newServers.push({
          type: "PROTO",
          source: oldServer.source,
          services: [],
        });
      } else {
        newServers.push({
          type: "PROTO",
          source: oldServer.source,
          services: newProto.services,
        });
      }
    }
    storage.servers.save(newServers);
    treeviews.servers.refresh(newServers);
  });

  vscode.commands.registerCommand("headers.add", async () => {
    const header = await vscode.window.showInputBox({
      title:
        `header that you can add to gRPC call, in format: ` +
        `"key: value", enable/disable by clicking`,
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
  });

  vscode.commands.registerCommand(
    "headers.remove",
    async (header: HeaderItem) => {
      storage.headers.remove(header.header.value);
    }
  );

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

  vscode.commands.registerCommand(
    "colections.run",
    async (col: CollectionItem) => {
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

  vscode.commands.registerCommand("files.import", async (file: ProtoItem) => {
    const importPath = await vscode.window.showInputBox({
      value: `/`,
      title: `Specify import path for imports.`,
    });
    if (importPath === undefined || importPath === ``) {
      return;
    }
    const source = file.proto.source as FileSource;
    storage.files.updateImportPath(source.filePath, importPath);
    treeviews.files.refresh(storage.files.list());
  });

  vscode.commands.registerCommand(`call.execute`, async () => {
    const files = storage.files.list();
    const servers = storage.servers.list();
    let sources: string[] = [];
    for (const file of files) {
      sources.push(`File: ${file.source.filePath}`);
    }
    for (const server of servers) {
      sources.push(`Server: ${server.source.host}`);
    }
    const sourceChoice = await vscode.window.showQuickPick(sources, {
      title: `Chose reflect server or proto file.`,
    });
    if (sourceChoice === undefined) {
      return;
    }
    let services: Service[] = [];
    let chosenSource: ServerSource | FileSource;
    if (sourceChoice.startsWith(`File: `)) {
      const filePathToExecute = sourceChoice.replace(`File: `, ``);
      for (const file of files) {
        if (file.source.filePath === filePathToExecute) {
          chosenSource = file.source;
          for (const service of file.services) {
            services.push(service);
          }
        }
      }
    }
    if (sourceChoice.startsWith(`Server: `)) {
      const serverHostToExecute = sourceChoice.replace(`Server: `, ``);
      for (const server of servers) {
        if (server.source.host === serverHostToExecute) {
          chosenSource = server.source;
          for (const service of server.services) {
            services.push(service);
          }
        }
      }
    }
    let serviceNames: string[] = [];
    for (const service of services) {
      serviceNames.push(`${service.package} - ${service.name}`);
    }
    const serviceChoice = await vscode.window.showQuickPick(serviceNames, {
      title: `Choose service`,
    });
    if (serviceChoice === undefined) {
      return;
    }
    let chosenService: Service;
    for (const service of services) {
      if (serviceChoice.split(` - `)[1] === service.name) {
        chosenService = service;
      }
    }
    let callNames: string[] = [];
    for (const call of chosenService!.calls) {
      callNames.push(`${call.name}`);
    }
    const callChoice = await vscode.window.showQuickPick(callNames);
    if (callChoice === undefined) {
      return;
    }
    let chosenCall: Call;
    for (const call of chosenService!.calls) {
      if (call.name === callChoice) {
        chosenCall = call;
      }
    }

    const params: GrpcTabParams = {
      call: chosenCall!,
      service: chosenService!,
      proto: {
        type: `PROTO`,
        services: services,
      },
      source: chosenSource!,
    };
    vscode.commands.executeCommand(`webview.open`, params);
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

    webview.createNewTab({
      request: val.request,
      info: val.info,
      headers: headers,
      hosts: storage.hosts.get(),
      response: val.response,
      expectations: expectations,
      snippet: ``,
    });
  });

  vscode.commands.registerCommand(
    "webview.open",
    async (data: GrpcTabParams) => {
      const maxMsgSize = vscode.workspace
        .getConfiguration(`grpc-clicker`)
        .get(`msgsize`, 4);

      const msg = await grpcurl.message({
        source: data.source,
        messageTag: data.call.inputMessageTag,
      });
      if (typeof msg === `string`) {
        vscode.window.showErrorMessage(msg);
        return;
      }

      let fileSource: FileSource | undefined;
      let request: Request;
      if (data.source.type === `FILE`) {
        fileSource = data.source;

        const hosts = storage.hosts.get();

        const reflectTimeout = vscode.workspace
          .getConfiguration(`grpc-clicker`)
          .get(`reflectTimeout`, 0.5);

        const serverSource: ServerSource = {
          type: "SERVER",
          host: hosts[0].adress,
          plaintext: hosts[0].plaintext,
          timeout: reflectTimeout,
        };

        request = {
          file: fileSource,
          content: msg.template!,
          server: serverSource,
          callTag: `${data.service.tag}/${data.call.name}`,
          maxMsgSize: maxMsgSize,
          headers: [],
        };
      } else {
        request = {
          file: fileSource,
          content: msg.template!,
          server: data.source,
          callTag: `${data.service.tag}/${data.call.name}`,
          maxMsgSize: maxMsgSize,
          headers: [],
        };
      }

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

      webview.createNewTab({
        request: request,
        info: info,
        headers: headers,
        hosts: storage.hosts.get(),
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

export function deactivate() {}
