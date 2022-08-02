import { Response } from "./grpcurl";

export class Parser {
  proto(input: string, path: string): Proto {
    const splittedInput = input.split("\n");

    let currComment = null;
    let proto: Proto = {
      name: ``,
      services: [],
      path: path,
      type: ProtoType.proto,
    };
    let currSvc: Service = {
      name: ``,
      description: null,
      calls: [],
      type: ProtoType.service,
    };

    for (const line of splittedInput) {
      if (line.includes(`//`)) {
        if (currComment === null) {
          currComment = ``;
        }
        currComment += line.replace(`//`, ``).trim() + `\n`;
        continue;
      }
      if (line.trim().includes(`is a service:`)) {
        if (proto.name !== ``) {
          continue;
        }
        proto.name = line
          .replace(` is a service:`, ``)
          .split(`.`)
          .slice(0, -1)
          .join(`.`);
        continue;
      }
      if (line.startsWith(`service `)) {
        if (currComment !== null) {
          currSvc.description = currComment.slice(0, -1);
          currComment = null;
        }
        currSvc.name = line.split(` `)[1];
      }
      if (line === `}`) {
        proto.services.push(currSvc);
        currSvc = {
          name: ``,
          description: null,
          calls: [],
          type: ProtoType.service,
        };
        continue;
      }
      if (line.includes(`  rpc `)) {
        const call = this.rpc(line);
        if (currComment !== null) {
          call.description = currComment.slice(0, -1);
          currComment = null;
        }
        currSvc.calls.push(call);
        continue;
      }
    }
    return proto;
  }

  rpc(line: string): Call {
    let call: Call = {
      type: ProtoType.call,
      name: "",
      description: null,
      inputStream: false,
      outputStream: false,
      inputMessageTag: "",
      outputMessageTag: "",
    };

    const splittedOpenBracket = line.split(`(`);
    if (splittedOpenBracket[1].startsWith(` stream `)) {
      call.inputStream = true;
    }

    const splittedClosedBracket = line.split(`)`);
    const preLast = splittedClosedBracket.length - 2;
    if (splittedClosedBracket[preLast].startsWith(` returns ( stream `)) {
      call.outputStream = true;
    }

    line = line.replaceAll(`stream `, ``);
    const spaceSplittedLine = line.trim().split(` `);
    call.name = spaceSplittedLine[1];
    call.inputMessageTag = spaceSplittedLine[3];
    call.outputMessageTag = spaceSplittedLine[7];
    return call;
  }

  message(input: string): Message {
    const splittedInput = input.split("\n");

    let currComment = null;
    let msg: Message = {
      type: ProtoType.message,
      name: "",
      tag: "",
      description: null,
      fields: [],
      template: input.split(`Message template:\n`)[1],
    };

    for (const line of splittedInput) {
      if (line.startsWith(`message `)) {
        if (currComment !== null) {
          msg.description = currComment.slice(0, -1);
          currComment = null;
        }
        msg.name = line.split(` `)[1];
        continue;
      }
      if (line.trim().endsWith(` is a message:`)) {
        msg.tag = line.split(` `)[0];
        continue;
      }
      if (line.includes(`//`)) {
        if (currComment === null) {
          currComment = ``;
        }
        currComment += line.replace(`//`, ``).trim() + `\n`;
        continue;
      }
      if (line.endsWith(`;`)) {
        let field = this.field(line);
        if (currComment !== null) {
          field.description = currComment;
          currComment = null;
        }
        msg.fields.push(field);
        continue;
      }
      if (line.startsWith(`Message template:\n`)) {
        break;
      }
    }
    return msg;
  }

  field(line: string): Field {
    line = line.trim();
    const isMap = line.startsWith(`map<`);
    let field: Field = {
      type: ProtoType.field,
      name: "",
      dataType: "",
      description: null,
      optional: line.startsWith(`optional`),
      repeated: line.startsWith(`repeated`),
      map: isMap,
      keyType: null,
      valueType: null,
    };
    if (isMap) {
      const mapValues = line
        .replace(`<`, ` `)
        .replace(`,`, ``)
        .replace(`>`, ``)
        .split(` `);
      field.dataType = `map`;
      field.keyType = mapValues[1];
      field.valueType = mapValues[2];
      field.name = mapValues[3];
      return field;
    }
    line = line.replace(`optional `, ``);
    line = line.replace(`repeated `, ``);
    const splitted = line.split(` `);
    field.dataType = splitted[0];
    field.name = splitted[1];
    return field;
  }

  resp(input: string): Response {
    let resp: Response = {
      respJson: "",
      code: null,
      time: null,
      errmes: null,
      date: null,
    };
    if (input.includes(`Failed to dial target host `)) {
      resp.code = `ConnectionError`;
      resp.errmes = input;
      return resp;
    }
    if (input.includes(`Command failed`)) {
      resp.code = `UnknownError`;
      resp.errmes = input;
      return resp;
    }
    if (input.includes(`ERROR:`)) {
      const splitted = input.split(`\n`);
      resp.code = splitted[2].replace(`  Code: `, ``);
      resp.errmes = splitted[3].replace(`  Message: `, ``);
      return resp;
    }
    // TODO add checks for unknown forms of errors
    resp.respJson = input;
    resp.code = `OK`;
    return resp;
  }
}

export enum ProtoType {
  proto,
  service,
  call,
  message,
  field,
}

export interface Proto {
  type: ProtoType;
  name: string;
  path: string;
  services: Service[];
}

export interface Service {
  type: ProtoType;
  name: string;
  description: string;
  calls: Call[];
}

export interface Call {
  type: ProtoType;
  name: string;
  description: string;
  inputStream: boolean;
  outputStream: boolean;
  inputMessageTag: string;
  outputMessageTag: string;
}

export interface Message {
  type: ProtoType;
  name: string;
  tag: string;
  description: string;
  template: string;
  fields: Field[];
}

export interface Field {
  type: ProtoType;
  name: string;
  dataType: string;
  description: string;
  optional: boolean;
  repeated: boolean;
  map: boolean;
  keyType: string;
  valueType: string;
}
