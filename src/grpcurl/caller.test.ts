import { Caller, FormCliTemplateParams, ProtoSource } from "./caller";

const src: ProtoSource = {
  adress: "localhost:8080",
  plaintext: true,
  timeout: 5,
  filePath: undefined,
  group: undefined,
  importPath: ``,
  uuid: "",
  name: "",
  unix: false,
  customFlags: undefined
};

test(`form`, () => {
  const caller = new Caller();
  const form: FormCliTemplateParams = {
    cliCommand: `grpcurl -msg-template |SRC| describe %s`,
    source: src,
    args: [`.google.protobuf.Empty`],
    forceOnlyFile: false
  };
  const res = `grpcurl -msg-template  -plaintext -max-time 5 localhost:8080  describe .google.protobuf.Empty`;
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
