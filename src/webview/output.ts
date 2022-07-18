export interface Output {
  proto: string;
  version: string;
  requestName: string;
  requestRepresentation: string;
  responseName: string;
  responseRepresentation: string;
  adress: string;
  call: string;
  tls: boolean;
  stream: boolean;
  meta: string[];
  time: string;
  code: number;
  response: string;
}
