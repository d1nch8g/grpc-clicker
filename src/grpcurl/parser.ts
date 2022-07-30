export class Parser {
  proto(input: string): Proto {
    const splittedInput = input.split("\n");

    let proto: Proto = {
      name: ``,
      services: [],
    };

    let currComment = ``;
    let currSvc: Service = {
      name: ``,
      tag: ``,
      description: ``,
      calls: [],
    };

    for (const line of splittedInput) {
      if (line.includes(`//`)) {
        currComment += line.replace(`//`, ``).trim() + `\n`;
      }
      if (line.includes(`is a service:`)) {
        currComment = ``;
        currSvc.tag = line.replace(` is a service:`, ``);
        currSvc.name = currSvc.tag.split(`.`).splice(-1).join(`.`);
        currSvc.description = currComment.slice(0, -2);
      }
      if (line === `}`) {
        proto.services.push(currSvc);
        currSvc = { name: ``, tag: ``, description: ``, calls: [] };
      }
      if (line.includes(`  rpc `)) {
        const call = this.rpc(line);
        call.description = currComment.slice(0, -2);
        currComment = ``;
        currSvc.calls.push(call);
      }
    }
    return proto;
  }
  rpc(line: string): Call {
    let call: Call = {
      name: "",
      description: "",
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
