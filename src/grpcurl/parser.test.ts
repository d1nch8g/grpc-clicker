import { Parser } from "./parser";

const goodInput = `pb.v1.Streams is a service:
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
const rpcUnaryLine = `  rpc Sint32Call ( .pb.v1.Sint32Mes ) returns ( .pb.v1.Sint32Mes );`;
const rpcStreamLine = `  rpc BiDirectioalStream ( stream .pb.v1.StringMes ) returns ( stream .pb.v1.StringMes );`;

test(`parse unary rpc`, () => {
  const parser = new Parser();
  const call = parser.rpc(rpcUnaryLine);
  expect(call.name).toBe(`Sint32Call`);
  expect(call.inputStream).toBeFalsy();
  expect(call.outputStream).toBeFalsy();
  expect(call.inputMessageTag).toBe(`.pb.v1.Sint32Mes`);
  expect(call.outputMessageTag).toBe(`.pb.v1.Sint32Mes`);
});

test(`parse stream rpc`, () => {
  const parser = new Parser();
  const call = parser.rpc(rpcStreamLine);
  expect(call.name).toBe(`BiDirectioalStream`);
  expect(call.inputStream).toBeTruthy();
  expect(call.outputStream).toBeTruthy();
  expect(call.inputMessageTag).toBe(`.pb.v1.StringMes`);
  expect(call.outputMessageTag).toBe(`.pb.v1.StringMes`);
});

test(`parse proto`, () => {
  const parser = new Parser();
  const proto = parser.proto(goodInput);
  expect(proto.name).toBe(`pb.v1`);
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
});

test(`parse message`, () => {
  const parser = new Parser();
});
