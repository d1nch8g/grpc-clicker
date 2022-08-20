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
 * All possible gRPC response codes.
 */
export enum GrpcCode {
  /**
   * 	Not an error; returned on success.
   */
  ok = `OK`,
  /**
   * 	The operation was cancelled, typically by the caller.
   */
  cancelled = `Cancelled`,
  /**
   * Unknown error. For example, this error may be returned when a Status
   * value received from another address space belongs to an error space
   * that is not known in this address space. Also errors raised by APIs
   * that do not return enough error information may be converted to this error.
   */
  unknown = `Unknown`,
  /**
   * The client specified an invalid argument. Note that this differs from
   * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
   * problematic regardless of the state of the system
   * (e.g., a malformed file name).
   */
  invalidArgument = `InvalidArgument`,
  /**
   * The deadline expired before the operation could complete. For operations
   * that change the state of the system, this error may be returned even if
   * the operation has completed successfully. For example, a successful
   * response from a server could have been delayed long
   */
  deadlineExceeded = `DeadlineExceeded`,
  /**
   * Some requested entity (e.g., file or directory) was not found. Note to
   * server developers: if a request is denied for an entire class of users,
   * such as gradual feature rollout or undocumented allowlist, NOT_FOUND may
   * be used. If a request is denied for some users within a class of users,
   * such as user-based access control, PERMISSION_DENIED must be used.
   */
  notFound = `NotFound`,
  /**
   * The entity that a client attempted to create (e.g., file or directory)
   * already exists.
   */
  alreadyExists = `AlreadyExists`,
  /**
   * The caller does not have permission to execute the specified operation.
   * PERMISSION_DENIED must not be used for rejections caused by exhausting
   * some resource (use RESOURCE_EXHAUSTED instead for those errors).
   * PERMISSION_DENIED must not be used if the caller can not be identified
   * (use UNAUTHENTICATED instead for those errors). This error code does not
   * imply the request is valid or the requested entity exists or satisfies
   * other pre-conditions.
   */
  permissionDenied = `PermissionDenied`,
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or
   * perhaps the entire file system is out of space.
   */
  resourceExhausted = `ResourceExhausted`,
  /**
   * The operation was rejected because the system is not in a state required
   * for the operation's execution. For example, the directory to be deleted
   * is non-empty, an rmdir operation is applied to a non-directory, etc.
   * Service implementors can use the following guidelines to decide between
   * FAILED_PRECONDITION, ABORTED, and UNAVAILABLE: (a) Use UNAVAILABLE if the
   * client can retry just the failing call. (b) Use ABORTED if the client
   * should retry at a higher level (e.g., when a client-specified test-and-set
   * fails, indicating the client should restart a read-modify-write sequence).
   * (c) Use FAILED_PRECONDITION if the client should not retry until the
   * system state has been explicitly fixed. E.g., if an "rmdir" fails because
   * the directory is non-empty, FAILED_PRECONDITION should be returned since
   * the client should not retry unless the files are
   * deleted from the directory.
   */
  failedPrecondition = `FailedPrecondition`,
  /**
   * The operation was aborted, typically due to a concurrency issue such as
   * a sequencer check failure or transaction abort. See the guidelines above
   * for deciding between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE.
   */
  aborted = `Aborted`,
  /**
   * The operation was attempted past the valid range. E.g., seeking or
   * reading past end-of-file. Unlike INVALID_ARGUMENT, this error indicates
   * a problem that may be fixed if the system state changes. For example, a
   * 32-bit file system will generate INVALID_ARGUMENT if asked to read at an
   * offset that is not in the range [0,2^32-1], but it will generate
   * OUT_OF_RANGE if asked to read from an offset past the current file size.
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
   * when it applies so that callers who are iterating through a space can
   * easily look for an OUT_OF_RANGE error to detect when they are done.
   */
  outOfRange = `OutOfRange`,
  /**
   * The operation is not implemented or is not supported/enabled in this
   * service.
   */
  unimplemented = `Unimplemented`,
  /**
   * Internal errors. This means that some invariants expected by the
   * underlying system have been broken. This error code is reserved
   * for serious errors.
   */
  internal = `Internal`,
  /**
   * The service is currently unavailable. This is most likely a transient
   * condition, which can be corrected by retrying with a backoff. Note that
   * it is not always safe to retry non-idempotent operations.
   */
  unavailable = `Unavailable`,
  /**
   * Unrecoverable data loss or corruption.
   */
  dataLoss = `DataLoss`,
  /**
   * The request does not have valid authentication credentials for
   * the operation.
   */
  unauthenticated = `Unauthenticated`,
}

/**
 * Parsed proto response
 */
export interface Response {
  /**
   * Recived gRPC code of response
   */
  code: GrpcCode;
  /**
   * Response containing JSON string of message or error message
   */
  response: string;
}

/**
 * Instance of parser used to parse CLI command outputs
 */
export class Parser {
  /**
   * Parse response for proto description
   */
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

  /**
   * Parse response for rpc call
   */
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

  /**
   * Parse response for protobuf message entity
   */
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

  /**
   * Parse single field from proto message
   */
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

  /**
   * Parse CLI response of gRPC call execution
   */
  resp(input: string): Response {
    let resp: Response = {
      code: GrpcCode.ok,
      response: "",
    };
    if (input.includes(`Failed to dial target host `)) {
      resp.code = GrpcCode.unavailable;
      resp.response = input;
      return resp;
    }
    if (input.includes(`ERROR:`)) {
      const splitted = input.split(`\n`);
      for (const line of splitted) {
        if (line.includes(`  Code: `)) {
          const code: string = line.replace(`  Code: `, ``);
          resp.code = code as GrpcCode;
        }
        if (line.includes(`  Message: `)) {
          resp.response = line.replace(`  Message: `, ``);
        }
      }
      return resp;
    }
    if (input.includes(`Command failed`)) {
      resp.code = GrpcCode.unknown;
      resp.response = input;
      return resp;
    }
    resp.response = input;
    return resp;
  }
}
