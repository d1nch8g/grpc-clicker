import { Caller } from "./caller";
import { Grpcurl } from "./grpcurl";
import { Call, Field, Message, Parser, Proto } from "./parser";

class MockParser implements Parser {
  proto(input: string): Proto {
    return { name: `prot`, services: [] };
  }
  rpc(line: string): Call {
    throw new Error("Method not implemented.");
  }
  message(input: string): Message {
    return {
      name: `msg`,
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
    if (args[0] === `path` && args.length === 1) {
      return [`prot`, null];
    }
    if (args[1] === `msg`) {
      return [`msg`, null];
    }
    return [null, new Error(`error`)];
  }
}

test(`proto`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller());
  expect(await grpcurl.proto(`path`)).toStrictEqual([
    {
      name: `prot`,
      services: [],
    },
    null,
  ]);
  expect(await grpcurl.proto(`bad_path`)).toStrictEqual([
    null,
    new Error(`error`),
  ]);
});

test(`message`, async () => {
  const grpcurl = new Grpcurl(new MockParser(), new MockCaller());
  expect(await grpcurl.message(`path`, `msg`)).toStrictEqual([
    {
      name: `msg`,
      tag: `tag`,
      description: `dscr`,
      template: `tmplt`,
      fields: [],
    },
    null,
  ]);
  expect(await grpcurl.message(`path`, `msgs`)).toStrictEqual([
    null,
    new Error(`error`),
  ]);
});
