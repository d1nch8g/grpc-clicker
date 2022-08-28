import { Expectations, Grpcurl, Request, TestMistake } from "./grpcurl";
import { Call, Field, Message, Parser, Proto, ParsedResponse } from "./parser";
import {
  Caller,
  FileSource,
  FormCliTemplateParams,
  ServerSource,
} from "./caller";
import { Installer } from "./installer";

let executablePath = `/dist/grpcurl/grpcurl`;
if (process.platform === `win32`) {
  executablePath = `/dist/grpcurl/grpcurl.exe`;
}

class MockParser implements Parser {
  resp(input: string): ParsedResponse {
    return {
      code: `OK`,
      content: input,
    };
  }
  proto(input: string): Proto {
    return {
      services: [
        {
          type: `SERVICE`,
          package: `stuff`,
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
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [command, undefined];
  }
}

test(`protoFile`, async () => {
  const grpcurl = new Grpcurl(
    new MockParser(),
    new MockCaller(),
    new Installer(),
    ``
  );

  const expectedResult: Proto = {
    type: `PROTO`,
    services: [
      {
        type: `SERVICE`,
        package: `stuff`,
        name: ``,
        tag: ``,
        description: `${executablePath} -max-time 0.5 -import-path / -proto docs/api.proto describe`,
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
  const grpcurl = new Grpcurl(
    new MockParser(),
    new MockCaller(),
    new Installer(),
    ``
  );

  const expectedResult: Proto = {
    type: `PROTO`,
    services: [
      {
        type: `SERVICE`,
        package: `stuff`,
        name: ``,
        tag: ``,
        description: `${executablePath} -max-time 0.5 -plaintext localhost:12201 describe`,
        calls: [],
      },
    ],
  };

  const serverSource: ServerSource = {
    type: `SERVER`,
    host: `localhost:12201`,
    plaintext: true,
  };

  expect(await grpcurl.proto(serverSource)).toStrictEqual(expectedResult);
});

test(`message`, async () => {
  const grpcurl = new Grpcurl(
    new MockParser(),
    new MockCaller(),
    new Installer(),
    ``
  );

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
    name: `${executablePath} -msg-template -import-path / -proto docs/api.proto describe .pb.v1.StringMes`,
    tag: `tag`,
    description: `dscr`,
    template: `tmplt`,
    fields: [],
  });
});

test(`send`, async () => {
  const grpcurl = new Grpcurl(
    new MockParser(),
    new MockCaller(),
    new Installer(),
    ``
  );

  const fileSouce: FileSource = {
    type: `FILE`,
    filePath: `docs/api.proto`,
    importPath: `/`,
  };

  const serverSource: ServerSource = {
    type: `SERVER`,
    host: `localhost:12201`,
    plaintext: true,
  };

  const request: Request = {
    file: fileSouce,
    content: `{}`,
    server: serverSource,
    callTag: `.pb.v1.Constructions/EmptyCall`,
    maxMsgSize: 1,
    headers: [`username: user`, `password: password`],
  };

  const resp = await grpcurl.send(request);

  expect(resp.code).toBe(`OK`);

  const winExpect = `${executablePath} -emit-defaults -H \"username: user\" -H \"password: password\"  -max-msg-sz 1048576 -d \"{}\" -import-path / -proto docs/api.proto -plaintext localhost:12201 .pb.v1.Constructions/EmptyCall`;
  const linuxExpect = `${executablePath} -emit-defaults -H 'username: user' -H 'password: password'  -max-msg-sz 1048576 -d '{}' -import-path / -proto docs/api.proto -plaintext localhost:12201 .pb.v1.Constructions/EmptyCall`;

  if (process.platform === "win32") {
    expect(resp.content).toBe(winExpect);
  } else {
    expect(resp.content).toBe(linuxExpect);
  }
});

test(`test`, async () => {
  const grpcurl = new Grpcurl(
    new MockParser(),
    new MockCaller(),
    new Installer(),
    ``
  );

  const fileSouce: FileSource = {
    type: `FILE`,
    filePath: `docs/api.proto`,
    importPath: `/`,
  };

  const serverSource: ServerSource = {
    type: `SERVER`,
    host: `localhost:12201`,
    plaintext: true,
  };

  const request: Request = {
    file: fileSouce,
    content: `{}`,
    server: serverSource,
    callTag: `.pb.v1.Constructions/EmptyCall`,
    maxMsgSize: 1,
    headers: [`username: user`, `password: password`],
  };

  const expects: Expectations = {
    code: "AlreadyExists",
    time: 0.0001,
    content: `wtfshere`,
  };

  const testresult = await grpcurl.test(request, expects);

  const firstMistake: TestMistake = {
    type: `code`,
    actual: "OK",
    expected: "AlreadyExists",
  };

  expect(testresult.passed).toBeFalsy();
  expect(testresult.mistakes.length).toBe(3);
  expect(testresult.mistakes[0]).toStrictEqual(firstMistake);
  expect(testresult.mistakes[1].type).toBe(`time`);
  expect(testresult.mistakes[1].expected).toBe(`0.0001s`);
  expect(testresult.mistakes[2].type).toBe(`content`);
  expect(testresult.mistakes[2].expected).toBe(`wtfshere`);
});
