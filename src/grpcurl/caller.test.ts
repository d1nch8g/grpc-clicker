import { Caller, FormCliTemplateParams } from "./caller";

test(`form`, () => {
  const caller = new Caller();
  const form: FormCliTemplateParams = {
    cliCommand: `grpcurl -msg-template |SRC| describe %s`,
    useDocker: false,
    source: {
      type: `SERVER`,
      host: `localhost:12201`,
      usePlaintext: true,
    },
    args: [`.google.protobuf.Empty`],
  };
  const res = `grpcurl -msg-template -plaintext localhost:12201 describe .google.protobuf.Empty`;
  expect(caller.buildCliCommand(form)).toBe(res);
});

test("success", async () => {
  const caller = new Caller();

  const [rez, err] = await caller.execute(`cd .`);
  expect(err).toBeUndefined();
  expect(rez).toBe(``);
});

test("error", async () => {
  const caller = new Caller();
  const [rez, err] = await caller.execute(`wasdas . asd`);
  expect(rez).toBe(``);
  expect(err!.message).toContain(`Command failed: wasdas . asd`);
});

const winRegularCallNoPath = `grpcurl -import-path / -proto C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
const winDockerizedCallNoPath = `docker run -v C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto fullstorydev/grpcurl -import-path / -proto \\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
const winRegularCallWithPath = `grpcurl -import-path / -proto C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
const winDockerizedCallWithPath = `docker run -v C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto fullstorydev/grpcurl -import-path / -proto \\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;

const linuxRegularCallNoPath = `grpcurl -import-path / -proto /Users/danilafominyh/Documents/grpclicker_vscode/server/api.proto describe`;
const linuxDockerizedCallNoPath = `docker run -v /Users/danilafominyh/Documents/grpclicker_vscode/server/api.proto:/Users/danilafominyh/Documents/grpclicker_vscode/server/api.proto fullstorydev/grpcurl -import-path / -proto /Users/danilafominyh/Documents/grpclicker_vscode/server/api.proto describe`;

test("dockerize", async () => {
  const caller = new Caller();
  if (process.platform === "win32") {
    expect(caller.dockerize(winRegularCallNoPath)).toBe(
      winDockerizedCallNoPath
    );
    expect(caller.dockerize(winRegularCallWithPath)).toBe(
      winDockerizedCallWithPath
    );
  } else {
    expect(caller.dockerize(linuxRegularCallNoPath)).toBe(
      linuxDockerizedCallNoPath
    );
  }
});
