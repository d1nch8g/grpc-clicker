/**
 * Parsed proto containing services
 */
export interface Proto {
  type: `PROTO`;
  /**
   * List of services source proto
   */
  services: Service[];
}

/**
 * Parsed proto service
 */
export interface Service {
  type: `SERVICE`;
  /**
   * Human readable name of service
   */
  name: string;
  /**
   * Tag of service that can be used for `grpcurl` commands
   */
  tag: string;
  /**
   * Optional description from source file comment if provided
   */
  description: string | undefined;
  /**
   * List of calls contained in service
   */
  calls: Call[];
}

/**
 * Parsed proto rpc call / method
 */
export interface Call {
  type: `CALL`;
  /**
   * Human readable description of `grpcurl` call
   */
  name: string;
  /**
   * Optional description from source file comment if provided
   */
  description: string | undefined;
  inputStream: boolean;
  outputStream: boolean;
  /**
   * `grpcurl` compatible message tag for message that will be sent
   */
  inputMessageTag: string;
  /**
   * `grpcurl` compatible message tag for message that will be recieved
   */
  outputMessageTag: string;
}

/**
 * Parsed proto message
 */
export interface Message {
  type: `MESSAGE`;
  /**
   * Human readable name of message
   */
  name: string;
  /**
   * `grpcurl` compatible tag of message
   */
  tag: string;
  /**
   * `grpcurl` compatible tag of message
   */
  description: string | undefined;
  /**
   * JSON template of message generated by `grpcurl`
   */
  template: string | undefined;
  /**
   * Parsed fields of message
   */
  fields: Field[];
}

/**
 * Parsed proto field
 */
export interface Field {
  type: `FIELD`;
  /**
   * Human readable name
   */
  name: string;
  /**
   * `grpcurl` compatible description of field type, examples:
   * - `string`
   * - `map<string, string>`
   * - `google.protobuf.Empty`
   */
  datatype: string;
  /**
   * Optional description from source file comment if provided
   */
  description: string | undefined;
  /**
   * Tag of inner message. Provided for nested messages, that could be 'unfolded'
   */
  innerMessageTag: string | undefined;
  /**
   * List of inner fields that is provided for nested messages and enums
   */
  fields: Field[] | undefined;
}

/**
 * Parsed proto response
 */
export interface Response {
  code: string;
  response: string;
  time: number;
  date: string;
}

export class Parser {
  proto(input: string): Proto {
    const splittedInput = input.split("\n");

    let currComment = undefined;
    let proto: Proto = {
      type: `PROTO`,
      services: [],
    };
    let currSvc: Service = {
      type: `SERVICE`,
      name: ``,
      description: undefined,
      tag: ``,
      calls: [],
    };

    for (const line of splittedInput) {
      if (line.includes(`//`)) {
        if (currComment === undefined) {
          currComment = ``;
        }
        currComment += line.replace(`//`, ``).trim() + `\n`;
        continue;
      }
      if (line.trim().endsWith(` is a service:`)) {
        const svcTag = line.replace(` is a service:`, ``);
        const splittedTag = svcTag.split(`.`);
        currSvc = {
          type: `SERVICE`,
          name: splittedTag[splittedTag.length - 1],
          tag: svcTag,
          description: undefined,
          calls: [],
        };
        continue;
      }
      if (line.startsWith(`service `)) {
        if (currComment !== undefined) {
          currSvc.description = currComment.slice(0, -1);
          currComment = undefined;
        }
        currSvc.name = line.split(` `)[1];
      }
      if (line === `}`) {
        proto.services.push(currSvc);
        continue;
      }
      if (line.includes(`  rpc `)) {
        const call = this.rpc(line);
        if (currComment !== undefined) {
          call.description = currComment.slice(0, -1);
          currComment = undefined;
        }
        currSvc.calls.push(call);
        continue;
      }
    }
    return proto;
  }

  rpc(line: string): Call {
    let call: Call = {
      type: `CALL`,
      name: "",
      description: undefined,
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

    let currComment: string | undefined = undefined;
    let msg: Message = {
      type: `MESSAGE`,
      name: "",
      tag: "",
      description: undefined,
      fields: [],
      template: input.split(`Message template:\n`)[1],
    };

    if (splittedInput[0].endsWith(`an enum:`)) {
      const tag = splittedInput[0].split(` `)[0];
      const splittedTag = tag.split(`.`);
      msg.tag = tag;
      msg.name = splittedTag[splittedTag.length - 1];
      msg.template = undefined;
      for (const line of splittedInput) {
        if (line.includes(`//`)) {
          if (currComment === undefined) {
            currComment = ``;
          }
          currComment += line.replace(`//`, ``).trim() + `\n`;
          continue;
        }
        if (line.startsWith(`enum `)) {
          if (currComment !== undefined) {
            msg.description = currComment.slice(0, -1);
          }
          currComment = undefined;
        }
        if (line.endsWith(`;`)) {
          const field = this.field(line);
          if (currComment !== undefined) {
            field.description = currComment.slice(0, -1);
          }
          currComment = undefined;
          msg.fields.push(field);
        }
      }
      return msg;
    }

    let currOneOf: Field = {
      type: `FIELD`,
      name: "",
      datatype: "oneof",
      description: undefined,
      innerMessageTag: undefined,
      fields: [],
    };
    let pushToOneOf = false;
    for (const line of splittedInput) {
      if (line.startsWith(`  oneof`)) {
        if (currComment !== undefined) {
          currOneOf.description = currComment.slice(0, -1);
          currComment = undefined;
        }
        currOneOf.name = line.replace(`  oneof `, ``).replace(` {`, ``);
        pushToOneOf = true;
      }
      if (line.endsWith(`}`) && pushToOneOf) {
        pushToOneOf = false;
        msg.fields.push(currOneOf);
        currOneOf = {
          type: `FIELD`,
          name: "",
          datatype: "oneof",
          description: undefined,
          innerMessageTag: undefined,
          fields: [],
        };
      }
      if (line.startsWith(`message `)) {
        if (currComment !== undefined) {
          msg.description = currComment.slice(0, -1);
          currComment = undefined;
        }
        msg.name = line.split(` `)[1];
        continue;
      }
      if (line.trim().endsWith(` is a message:`)) {
        msg.tag = line.split(` `)[0];
        continue;
      }
      if (line.includes(`//`)) {
        if (currComment === undefined) {
          currComment = ``;
        }
        currComment += line.replace(`//`, ``).trim() + `\n`;
        continue;
      }
      if (line.endsWith(`;`)) {
        let field = this.field(line);
        if (currComment !== undefined) {
          field.description = currComment;
          currComment = undefined;
        }
        if (pushToOneOf) {
          currOneOf.fields!.push(field);
        } else {
          msg.fields.push(field);
        }
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
    const spaceSplit = line.split(" ");
    let field: Field = {
      type: `FIELD`,
      name: spaceSplit[spaceSplit.length - 3],
      datatype: spaceSplit.slice(0, spaceSplit.length - 3).join(` `),
      description: undefined,
      innerMessageTag: undefined,
      fields: undefined,
    };
    if (line.includes(`.`)) {
      field.fields = [];
      for (const value of spaceSplit) {
        if (value.includes(`.`)) {
          field.innerMessageTag = value.replace(`>`, ``);
        }
      }
    }
    if (line.startsWith(`map<`)) {
      field.datatype = `${spaceSplit[0]} ${spaceSplit[1]}`;
    }
    return field;
  }

  resp(input: string): Response {
    let resp: Response = {
      response: "",
      code: "",
      time: 0,
      date: "",
    };
    if (input.includes(`Failed to dial target host `)) {
      resp.code = `ConnectionError`;
      resp.response = input;
      return resp;
    }
    if (input.includes(`ERROR:`)) {
      const splitted = input.split(`\n`);
      for (const line of splitted) {
        if (line.includes(`  Code: `)) {
          resp.code = line.replace(`  Code: `, ``);
        }
        if (line.includes(`  Message: `)) {
          resp.response = line.replace(`  Message: `, ``);
        }
      }
      return resp;
    }
    if (input.includes(`Command failed`)) {
      resp.code = `UnknownError`;
      resp.response = input;
      return resp;
    }
    resp.response = input;
    resp.code = `OK`;
    return resp;
  }
}
