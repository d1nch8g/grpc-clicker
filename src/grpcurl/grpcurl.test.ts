import { Caller, RequestForm } from "./caller";
import { Grpcurl, Response } from "./grpcurl";
import { Call, Field, Message, Parser, Proto, ProtoType } from "./parser";
import * as util from "util";

class MockParser implements Parser {
  resp(input: string): Response {
    return {
      code: `ok`,
      response: input,
      time: `ok`,
      errmes: `ok`,
      date: ``,
    };
  }
  proto(input: string): Proto {
    return {
      name: input,
      services: [],
      type: ProtoType.proto,
      source: `path`,
      error: undefined,
    };
  }
  rpc(line: string): Call {
    throw new Error("Method not implemented.");
  }
  message(input: string): Message {
    return {
      type: ProtoType.message,
      name: input,
      tag: `tag`,
      description: `dscr`,
      template: `tmplt`,
      fields: [],
      error: undefined,
    };
  }
  field(line: string): Field {
    throw new Error("Method not implemented.");
  }
}

class MockCaller implements Caller {
  caller: Caller = new Caller();
  form(input: RequestForm): string {
    return this.caller.form(input);
  }
  async execute(command: string): Promise<[string, Error | undefined]> {
    return [command, undefined];
  }
  dockerize(input: string): string {
    return this.caller.dockerize(input);
  }
}

test(`proto`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  expect(
    await grpcurl.proto({
      source: `docs/api.proto`,
      server: false,
      plaintext: false,
    })
  ).toStrictEqual({
    type: ProtoType.proto,
    name: `grpcurl -import-path / -proto docs/api.proto describe`,
    source: `path`,
    services: [],
    error: undefined,
  });
});

test(`message`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  expect(
    await grpcurl.message({
      source: `docs/api.proto`,
      server: false,
      plaintext: false,
      tag: `.pb.v1.StringMes`,
    })
  ).toStrictEqual({
    type: ProtoType.message,
    name: `grpcurl -msg-template -import-path / -proto docs/api.proto describe .pb.v1.StringMes`,
    tag: `tag`,
    description: `dscr`,
    template: `tmplt`,
    fields: [],
    error: undefined,
  });
});

test(`send`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  let resp = await grpcurl.send({
    path: "docs/api.proto",
    json: "{}",
    host: "localhost:12201",
    call: "pb.v1.Constructions.EmptyCall",
    plaintext: true,
    metadata: [`username: user`, `passsword: password`],
    maxMsgSize: 4,
  });
  expect(resp.code).toBe(`ok`);
  expect(resp.errmes).toBe(`ok`);

  const expectedCommand = `grpcurl -H \"username: user\" -H \"passsword: password\"  -max-msg-sz 4194304 -d \"{}\" -plaintext localhost:12201 pb.v1.Constructions.EmptyCall`;

  expect(resp.response).toBe(expectedCommand);
});

test(`checkInstalled`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  const resp = await grpcurl.installed();
  expect(resp).toBeTruthy();
});
