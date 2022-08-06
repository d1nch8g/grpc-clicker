import { Caller } from "./caller";

test("success", async () => {
  const caller = new Caller();
  const [rez, err] = await caller.execute(`cd`, [`.`], false);
  expect(err).toBeNull();
  expect(rez).toBe(``);
});

test("error", async () => {
  const caller = new Caller();
  const [rez, err] = await caller.execute(`wasdas`, [`.`, `asd`], false);
  expect(rez).toBeNull();
  expect(err.message).toContain(`Command failed: wasdas . asd`);
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
