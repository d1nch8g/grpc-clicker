import { Caller, FormCliTemplateParams } from "./caller";

test(`form`, () => {
  const caller = new Caller();
  const form: FormCliTemplateParams = {
    cliCommand: `grpcurl -msg-template |SRC| describe %s`,
    source: {
      type: `SERVER`,
      host: `localhost:12201`,
      plaintext: true,
      timeout: 0.5,
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
