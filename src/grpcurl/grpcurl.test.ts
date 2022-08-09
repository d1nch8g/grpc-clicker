import { Caller, RequestForm } from "./caller";
import { Grpcurl, ProtoFile, ProtoServer, Response } from "./grpcurl";
import { Call, Field, Message, Parser, Proto, ProtoType } from "./parser";
import * as util from "util";

class MockParser implements Parser {
  resp(input: string): Response {
    return {
      code: `ok`,
      response: input,
      time: `ok`,
      date: ``,
    };
  }
  proto(input: string): Proto {
    return {
      name: input,
      services: [],
      type: ProtoType.proto,
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

test(`protoFile`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  const expectedResult: ProtoFile = {
    type: ProtoType.proto,
    path: "docs/api.proto",
    name: "grpcurl -import-path / -proto docs/api.proto describe",
    hosts: ["localhost:12201"],
    services: [],
  };
  expect(
    await grpcurl.protoFile({
      path: "docs/api.proto",
      hosts: [`localhost:12201`],
    })
  ).toStrictEqual(expectedResult);
});

test(`protoServer`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  const expectedResult: ProtoServer = {
    type: ProtoType.proto,
    host: "localhost:12201",
    plaintext: true,
    name: "grpcurl -plaintext localhost:12201 describe",
    services: [],
  };
  expect(
    await grpcurl.protoServer({
      host: `localhost:12201`,
      plaintext: true,
    })
  ).toStrictEqual(expectedResult);
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

  const winExpect = `grpcurl -H \"username: user\" -H \"passsword: password\"  -max-msg-sz 4194304 -d \"{}\" -plaintext localhost:12201 pb.v1.Constructions.EmptyCall`;
  const linuxExpect = `grpcurl -H 'username: user' -H 'passsword: password'  -max-msg-sz 4194304 -d '{}' -plaintext localhost:12201 pb.v1.Constructions.EmptyCall`;

  if (process.platform === "win32") {
    expect(resp.response).toBe(winExpect);
  } else {
    expect(resp.response).toBe(linuxExpect);
  }
});

test(`checkInstalled`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  const resp = await grpcurl.installed();
  expect(resp).toBeTruthy();
});
