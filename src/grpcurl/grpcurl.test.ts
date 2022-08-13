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
      services: [
        {
          type: ProtoType.service,
          name: ``,
          tag: ``,
          description: input,
          calls: [],
        },
      ],
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
  formSource(input: RequestForm): string {
    return this.caller.formSource(input);
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
    hosts: [
      {
        adress: `localhost:12201`,
        plaintext: true,
      },
    ],
    services: [
      {
        type: ProtoType.service,
        name: ``,
        tag: ``,
        description: "grpcurl -import-path / -proto docs/api.proto describe",
        calls: [],
      },
    ],
    importPath: "/",
  };
  expect(
    await grpcurl.protoFile({
      path: "docs/api.proto",
      hosts: [
        {
          adress: `localhost:12201`,
          plaintext: true,
        },
      ],
      importPath: `/`,
    })
  ).toStrictEqual(expectedResult);
});

test(`protoServer`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);
  const expectedResult: ProtoServer = {
    type: ProtoType.proto,
    adress: "localhost:12201",
    plaintext: true,
    services: [
      {
        type: ProtoType.service,
        name: ``,
        tag: ``,
        description:
          "grpcurl -max-time 0.5 -plaintext localhost:12201 describe",
        calls: [],
      },
    ],
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
      importPath: "/",
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
    importPath: `/`,
    json: "{}",
    host: {
      adress: `localhost:12201`,
      plaintext: true,
    },
    callTag: "pb.v1.Constructions.EmptyCall",
    metadata: [`username: user`, `passsword: password`],
    maxMsgSize: 4,
  });
  expect(resp.code).toBe(`ok`);

  const winExpect = `grpcurl -emit-defaults -H \"username: user\" -H \"passsword: password\"   -d \"{}\" -plaintext localhost:12201 pb.v1.Constructions.EmptyCall`;
  const linuxExpect = `grpcurl -emit-defaults -H 'username: user' -H 'passsword: password'   -d '{}' -plaintext localhost:12201 pb.v1.Constructions.EmptyCall`;

  if (process.platform === "win32") {
    expect(resp.response).toBe(winExpect);
  } else {
    expect(resp.response).toBe(linuxExpect);
  }
});
