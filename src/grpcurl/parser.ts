export class Parser {
  proto(input: string): Proto {
    const splittedInput = input.split("\n");

    let currComment = null;
    let proto: Proto = { name: ``, services: [] };
    let currSvc: Service = { name: ``, tag: ``, description: null, calls: [] };

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
        currSvc = { name: ``, tag: ``, description: null, calls: [] };
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
    let msg: Message = { name: "", tag: "", description: null, fields: [] };

    for (const line of splittedInput) {
      if (line.startsWith(`message `)) {
        msg.description = currComment.slice(0, -1);
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
      }
    }
    return msg;
  }

  field(line: string): Field {
    line = line.trim();
    const spaceSplitted = line.split(` `);
    let field: Field = {
      name: spaceSplitted[spaceSplitted.length - 3],
      type: "",
      typeTag: "",
      description: null,
      optional: line.startsWith(`optional`),
      repeated: line.startsWith(`repeated`),
      map: line.startsWith(`map`),
      keyType: "",
      valueType: "",
    };
    return field;
  }
}

interface Proto {
  name: string;
  services: Service[];
}

interface Service {
  name: string;
  tag: string;
  description: string;
  calls: Call[];
}

interface Call {
  name: string;
  description: string;
  inputStream: boolean;
  outputStream: boolean;
  inputMessageTag: string;
  outputMessageTag: string;
}

interface Message {
  name: string;
  tag: string;
  description: string;
  fields: Field[];
}

interface Field {
  name: string;
  type: string;
  typeTag: string;
  description: string;
  optional: boolean;
  repeated: boolean;
  map: boolean;
  keyType: string;
  valueType: string;
}
