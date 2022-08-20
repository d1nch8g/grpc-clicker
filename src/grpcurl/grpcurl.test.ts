import {
  Caller,
  FileSource,
  FormCliTemplateParams,
  ServerSource,
} from "./caller";
import { Grpcurl } from "./grpcurl";
import { Call, Field, Message, Parser, Proto, ParsedResponse } from "./parser";
import * as util from "util";

class MockParser implements Parser {
  resp(input: string): ParsedResponse {
    return {
      code: `ok`,
      response: input,
      time: 0,
      date: ``,
    };
  }
  proto(input: string): Proto {
    return {
      services: [
        {
          type: `SERVICE`,
          name: ``,
          tag: ``,
          description: input,
          calls: [],
        },
      ],
      type: `PROTO`,
    };
  }
  rpc(line: string): Call {
    throw new Error("Method not implemented.");
  }
  message(input: string): Message {
    return {
      type: `MESSAGE`,
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
  buildCliCommand(input: FormCliTemplateParams): string {
    return this.caller.buildCliCommand(input);
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

  const expectedResult: Proto = {
    type: `PROTO`,
    services: [
      {
        type: `SERVICE`,
        name: ``,
        tag: ``,
        description:
          "grpcurl -max-time 0.5 -import-path / -proto docs/api.proto describe",
        calls: [],
      },
    ],
  };

  const fileSouce: FileSource = {
    type: `FILE`,
    filePath: `docs/api.proto`,
    importPath: `/`,
  };

  expect(await grpcurl.proto(fileSouce)).toStrictEqual(expectedResult);
});

test(`protoServer`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);

  const expectedResult: Proto = {
    type: `PROTO`,
    services: [
      {
        type: `SERVICE`,
        name: ``,
        tag: ``,
        description:
          "grpcurl -max-time 0.5 -plaintext localhost:12201 describe",
        calls: [],
      },
    ],
  };

  const serverSource: ServerSource = {
    type: `SERVER`,
    host: `localhost:12201`,
    usePlaintext: true,
  };

  expect(await grpcurl.proto(serverSource)).toStrictEqual(expectedResult);
});

test(`message`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);

  const fileSouce: FileSource = {
    type: `FILE`,
    filePath: `docs/api.proto`,
    importPath: `/`,
  };

  expect(
    await grpcurl.message({
      source: fileSouce,
      messageTag: ".pb.v1.StringMes",
    })
  ).toStrictEqual({
    type: `MESSAGE`,
    name: `grpcurl -msg-template -import-path / -proto docs/api.proto describe .pb.v1.StringMes`,
    tag: `tag`,
    description: `dscr`,
    template: `tmplt`,
    fields: [],
  });
});

test(`send`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller(), false);

  const fileSouce: FileSource = {
    type: `FILE`,
    filePath: `docs/api.proto`,
    importPath: `/`,
  };

  const serverSource: ServerSource = {
    type: `SERVER`,
    host: `localhost:12201`,
    usePlaintext: true,
  };

  let resp = await grpcurl.send({
    file: fileSouce,
    json: `{}`,
    server: serverSource,
    callTag: `.pb.v1.Constructions/EmptyCall`,
    maxMsgSize: 1,
    headers: [`username: user`, `password: password`],
  });

  expect(resp.code).toBe(`ok`);

  const winExpect = `grpcurl -emit-defaults -H \"username: user\" -H \"password: password\"  -max-msg-sz 1048576 -d \"{}\" -import-path / -proto docs/api.proto -plaintext localhost:12201 .pb.v1.Constructions/EmptyCall`;
  const linuxExpect = `grpcurl -emit-defaults -H 'username: user' -H 'password: password'  -max-msg-sz 1048576 -d '{}' -import-path / -proto docs/api.proto -plaintext localhost:12201 .pb.v1.Constructions/EmptyCall`;

  if (process.platform === "win32") {
    expect(resp.response).toBe(winExpect);
  } else {
    expect(resp.response).toBe(linuxExpect);
  }
});
