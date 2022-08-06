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

const regularCallNoPath = `grpcurl -import-path / -proto C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
const dockerizedCallNoPath = `docker run -v C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto fullstorydev/grpcurl -import-path / -proto \\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
const regularCallWithPath = `grpcurl -import-path / -proto C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
const dockerizedCallWithPath = `docker run -v C:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto:\\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto fullstorydev/grpcurl -import-path / -proto \\\\Users\\dangd\\OneDrive\\Документы\\grpclicker_vscode\\server\\api.proto describe`;
test("dockerize", async () => {
  const caller = new Caller();
  expect(caller.dockerize(regularCallNoPath)).toBe(dockerizedCallNoPath);
  expect(caller.dockerize(regularCallWithPath)).toBe(dockerizedCallWithPath);
});
