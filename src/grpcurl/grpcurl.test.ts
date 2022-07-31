import { Caller } from "./caller";
import { Grpcurl, Response } from "./grpcurl";
import { Call, Field, Message, Parser, Proto } from "./parser";
import * as util from "util";

class MockParser implements Parser {
  resp(input: string): Response {
    return {
      code: `ok`,
      json: `ok`,
      time: `ok`,
      message: `ok`,
    };
  }
  proto(input: string): Proto {
    return { name: input, services: [] };
  }
  rpc(line: string): Call {
    throw new Error("Method not implemented.");
  }
  message(input: string): Message {
    return {
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
  async execute(form: string, args: string[]): Promise<[string, Error]> {
    if (args[0] === `err_conn`) {
      return [
        `Failed to dial target host "localhost:12201": dial tcp [::1]:12201: connectex: No connection could be made because the target machine actively refused it.`,
        null,
      ];
    }
    return [util.format(form, ...args), null];
  }
}

test(`proto`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller());
  expect(await grpcurl.proto(`docs/api.proto`)).toStrictEqual([
    {
      name: `grpcurl -import-path / -proto docs/api.proto describe`,
      services: [],
    },
    null,
  ]);
});

test(`message`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller());
  expect(
    await grpcurl.message(`docs/api.proto`, `.pb.v1.StringMes`)
  ).toStrictEqual([
    {
      name: `grpcurl -import-path / -proto docs/api.proto describe .pb.v1.StringMes`,
      tag: `tag`,
      description: `dscr`,
      template: `tmplt`,
      fields: [],
    },
    null,
  ]);
});

test(`send`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller());
  expect(
    await grpcurl.send({
      path: "docs/api.proto",
      reqJson: "{}",
      host: "localhost:12201",
      method: ".pb.v1.Constructions.EmptyCall",
      tlsOn: true,
      metadata: [`username: user`, `passsword: password`],
      maxMsgSize: 2000000,
    })
  ).toStrictEqual({
    code: `ok`,
    json: `ok`,
    time: `ok`,
    message: `ok`,
  });
});
