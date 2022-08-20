import { Field, GrpcCode, Message, Parser, Response } from "./parser";

const protoInput = `pb.v1.Streams is a service:
service Streams {
  rpc BiDirectioalStream ( stream .pb.v1.StringMes ) returns ( stream .pb.v1.StringMes );
  rpc ClientStream ( stream .pb.v1.StringMes ) returns ( .pb.v1.StringMes );
  rpc ServerStream ( .pb.v1.StringMes ) returns ( stream .pb.v1.StringMes );
}
pb.v1.Basics is a service:
// example svc description
service Basics {
  rpc BoolCall ( .pb.v1.BoolMes ) returns ( .pb.v1.BoolMes );
  rpc BytesCall ( .pb.v1.BytesMes ) returns ( .pb.v1.BytesMes );
  // example call description
  rpc DoubleCall ( .pb.v1.DoubleMes ) returns ( .pb.v1.DoubleMes );
  // another comment example
  rpc Fixed32Call ( .pb.v1.Fixed32Mes ) returns ( .pb.v1.Fixed32Mes );
  rpc Fixed64Call ( .pb.v1.Fixed64Mes ) returns ( .pb.v1.Fixed64Mes );
  rpc FloatCall ( .pb.v1.FloatMes ) returns ( .pb.v1.FloatMes );
  rpc Int32Call ( .pb.v1.Int32Mes ) returns ( .pb.v1.Int32Mes );
  rpc Int64Call ( .pb.v1.Int64Mes ) returns ( .pb.v1.Int64Mes );
  rpc Sfixed32Call ( .pb.v1.Sfixed32Mes ) returns ( .pb.v1.Sfixed32Mes );
  rpc Sfixed64Call ( .pb.v1.Sfixed64Mes ) returns ( .pb.v1.Sfixed64Mes );
  // some
  // multiline
  // comment
  // right here
  rpc Sint32Call ( .pb.v1.Sint32Mes ) returns ( .pb.v1.Sint32Mes );
  rpc Sint64Call ( .pb.v1.Sint64Mes ) returns ( .pb.v1.Sint64Mes );
  rpc StringCall ( .pb.v1.StringMes ) returns ( .pb.v1.StringMes );
  rpc Uint32Call ( .pb.v1.Uint32Mes ) returns ( .pb.v1.Uint32Mes );
  rpc Uint64Call ( .pb.v1.Uint64Mes ) returns ( .pb.v1.Uint64Mes );
}
pb.v1.Constructions is a service:
service Constructions {
  rpc AnyCall ( .google.protobuf.Any ) returns ( .google.protobuf.Any );
  rpc EmptyCall ( .google.protobuf.Empty ) returns ( .google.protobuf.Empty );
  rpc EnumCall ( .pb.v1.EnumMes ) returns ( .pb.v1.EnumMes );
  rpc ListCall ( .pb.v1.ListMes ) returns ( .pb.v1.ListMes );
  rpc MapCall ( .pb.v1.MapMes ) returns ( .pb.v1.MapMes );
  rpc NestedCall ( .pb.v1.NestedMes ) returns ( .pb.v1.NestedMes );
  rpc OneofCall ( .pb.v1.OneofMes ) returns ( .pb.v1.OneofMes );
  rpc OptionalCall ( .pb.v1.OptionalMes ) returns ( .pb.v1.OptionalMes );
}`;

test(`proto`, () => {
  const parser = new Parser();
  const proto = parser.proto(protoInput);
  expect(proto.services.length).toBe(3);
  expect(proto.services[0].name).toBe(`Streams`);
  expect(proto.services[0].calls.length).toBe(3);
  expect(proto.services[1].calls[3].description).toBe(
    `another comment example`
  );
  expect(proto.services[1].calls[10].description).toBe(`some
multiline
comment
right here`);
  expect(proto.services[1].description).toBe(`example svc description`);
  expect(proto.services[1].calls[12].description).toBe(undefined);
  expect(proto.services[0].tag).toBe(`pb.v1.Streams`);
  expect(proto.services[0].name).toBe(`Streams`);
  expect(proto.services[1].tag).toBe(`pb.v1.Basics`);
  expect(proto.services[1].name).toBe(`Basics`);
});

const rpcUnaryLine = `  rpc Sint32Call ( .pb.v1.Sint32Mes ) returns ( .pb.v1.Sint32Mes );`;
test(`unary rpc`, () => {
  const parser = new Parser();
  const call = parser.rpc(rpcUnaryLine);
  expect(call.name).toBe(`Sint32Call`);
  expect(call.inputStream).toBeFalsy();
  expect(call.outputStream).toBeFalsy();
  expect(call.inputMessageTag).toBe(`.pb.v1.Sint32Mes`);
  expect(call.outputMessageTag).toBe(`.pb.v1.Sint32Mes`);
});

const rpcStreamLine = `  rpc BiDirectioalStream ( stream .pb.v1.StringMes ) returns ( stream .pb.v1.StringMes );`;
test(`stream rpc`, () => {
  const parser = new Parser();
  const call = parser.rpc(rpcStreamLine);
  expect(call.name).toBe(`BiDirectioalStream`);
  expect(call.inputStream).toBeTruthy();
  expect(call.outputStream).toBeTruthy();
  expect(call.inputMessageTag).toBe(`.pb.v1.StringMes`);
  expect(call.outputMessageTag).toBe(`.pb.v1.StringMes`);
});

test(`fields`, () => {
  const parser = new Parser();

  const field1 = `string example = 1;`;
  const expected1: Field = {
    type: `FIELD`,
    name: `example`,
    datatype: `string`,
    description: undefined,
    innerMessageTag: undefined,
    fields: undefined,
  };
  expect(parser.field(field1)).toStrictEqual(expected1);

  const field2 = `optional string example2 = 2;`;
  const expected2: Field = {
    type: `FIELD`,
    name: `example2`,
    datatype: `optional string`,
    description: undefined,
    innerMessageTag: undefined,
    fields: undefined,
  };
  expect(parser.field(field2)).toStrictEqual(expected2);

  const field3 = `repeated string example3 = 3;`;
  const expected3: Field = {
    type: `FIELD`,
    name: `example3`,
    datatype: `repeated string`,
    description: undefined,
    innerMessageTag: undefined,
    fields: undefined,
  };
  expect(parser.field(field3)).toStrictEqual(expected3);

  const field4 = `map<string, string> example4 = 4;`;
  const expected4: Field = {
    type: `FIELD`,
    name: `example4`,
    datatype: `map<string, string>`,
    description: undefined,
    innerMessageTag: undefined,
    fields: undefined,
  };
  expect(parser.field(field4)).toStrictEqual(expected4);

  const field5 = `.pb.v1.NestedMes example5 = 5;`;
  const expected5: Field = {
    type: `FIELD`,
    name: `example5`,
    datatype: `.pb.v1.NestedMes`,
    description: undefined,
    innerMessageTag: `.pb.v1.NestedMes`,
    fields: [],
  };
  expect(parser.field(field5)).toStrictEqual(expected5);

  const field6 = `map<string, .pb.v1.OptionalMes> example4 = 4;`;
  const expected6: Field = {
    type: `FIELD`,
    name: "example4",
    datatype: "map<string, .pb.v1.OptionalMes>",
    description: undefined,
    innerMessageTag: `.pb.v1.OptionalMes`,
    fields: [],
  };
  expect(parser.field(field6)).toStrictEqual(expected6);
});

const msgExample = `pb.v1.TestMessage is a message:    
// some
// comment
message TestMessage {
  // comment
  string example = 1;
  optional string example2 = 2;    
  repeated string example3 = 3;    
  map<string, string> example4 = 4;
  .pb.v1.NestedMes example5 = 5;   
}

Message template:
{
  "example": "",
  "example3": [
    ""
  ],
  "example4": {
    "": ""
  },
  "example5": {
    "title": "",
    "nested": {
      "title": ""
    }
  }
}`;

const enumExample = `pb.v1.Enum is an enum:
// wirdo boo
enum Enum {
  // coca cola        
  FIRST = 0;
  // keka
  // peka
  SECOND = 1;
}`;

test(`message`, () => {
  const parser = new Parser();
  const msg = parser.message(msgExample);
  expect(msg.description).toBe(`some
comment`);
  expect(msg.name).toBe(`TestMessage`);
  expect(msg.tag).toBe(`pb.v1.TestMessage`);
  expect(msg.template).toBe(`{
  "example": "",
  "example3": [
    ""
  ],
  "example4": {
    "": ""
  },
  "example5": {
    "title": "",
    "nested": {
      "title": ""
    }
  }
}`);
  const enumParsed = parser.message(enumExample);
  const expectedEnum: Message = {
    type: `MESSAGE`,
    name: "Enum",
    tag: "pb.v1.Enum",
    description: "wirdo boo",
    template: undefined,
    fields: [
      {
        type: `FIELD`,
        name: "FIRST",
        datatype: "",
        description: "coca cola",
        innerMessageTag: undefined,
        fields: undefined,
      },
      {
        type: `FIELD`,
        name: "SECOND",
        datatype: "",
        description: `keka\npeka`,
        innerMessageTag: undefined,
        fields: undefined,
      },
    ],
  };
  expect(enumParsed).toStrictEqual(expectedEnum);
});

const oneOfExample = `pb.v1.OneofMes is a message:
// example comment
message OneofMes {
  // example 2
  oneof message {
    // example field comment
    string first = 1;
    int32 second = 2;
  }
  // comcom
  int32 name = 3;
}

Message template:
{
  "name": 0
}`;

test(`oneof`, () => {
  const parser = new Parser();
  const expectedOneOf: Message = {
    type: `MESSAGE`,
    name: "OneofMes",
    tag: "pb.v1.OneofMes",
    description: "example comment",
    template: `{
  "name": 0
}`,
    fields: [
      {
        type: `FIELD`,
        name: "message",
        datatype: "oneof",
        description: "example 2",
        innerMessageTag: undefined,
        fields: [
          {
            type: `FIELD`,
            name: "first",
            datatype: "string",
            description: `example field comment\n`,
            innerMessageTag: undefined,
            fields: undefined,
          },
          {
            type: `FIELD`,
            name: "second",
            datatype: "int32",
            description: undefined,
            innerMessageTag: undefined,
            fields: undefined,
          },
        ],
      },
      {
        type: `FIELD`,
        name: "name",
        datatype: "int32",
        description: `comcom\n`,
        innerMessageTag: undefined,
        fields: undefined,
      },
    ],
  };
  const result = parser.message(oneOfExample);
  expect(result).toStrictEqual(expectedOneOf);
});

const codeErr = `EmptyCall
ERROR:
  Code: AlreadyExists
  Message: some err msg`;
const connErr = `Failed to dial target host "localhost:12201": dial tcp [::1]:12201: connectex: No connection could be made because the target machine actively refused it.`;
const goodResp = `{
  "message": "msg"
}`;
test(`response`, () => {
  const parser = new Parser();

  const firstExpectedResponse: Response = {
    code: GrpcCode.alreadyExists,
    response: "some err msg",
  };
  expect(parser.resp(codeErr)).toStrictEqual(firstExpectedResponse);

  const secondExpectedResponse: Response = {
    code: GrpcCode.unavailable,
    response: `Failed to dial target host "localhost:12201": dial tcp [::1]:12201: connectex: No connection could be made because the target machine actively refused it.`,
  };
  expect(parser.resp(connErr)).toStrictEqual(secondExpectedResponse);

  const thirdExpectedResponse: Response = {
    code: GrpcCode.ok,
    response: `{\n  "message": "msg"\n}`,
  };
  expect(parser.resp(goodResp)).toStrictEqual(thirdExpectedResponse);
});
