import { Caller, FormCliTemplateParams, ProtoSource } from "./caller";

const src: ProtoSource = {
  currentHost: "localhost:8080",
  additionalHosts: [],
  plaintext: true,
  timeout: 5,
  filePath: undefined,
  group: undefined,
  importPaths: []
}

test(`form`, () => {
  const caller = new Caller();
  const form: FormCliTemplateParams = {
    cliCommand: `grpcurl -msg-template |SRC| describe %s`,
    source: src,
    args: [`.google.protobuf.Empty`],
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
