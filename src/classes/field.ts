export class Field {
  public type: string;
  public field: string;
  public name: string;
  constructor(line: string) {
    let splitted = line.split(" ");
    let isMap = line.includes("map<") && line.includes(">");
    let isOptional = line.startsWith("  optional");
    let isRepeated = line.startsWith("  repeated");
    if (isMap) {
      var key = splitted[2].replace("map<", "").replace(",", "");
      var value = splitted[3].replace(">", "");
      this.type = `map<${key}, ${value}>`;
      this.field = splitted[4];
    }
    if (isOptional || isRepeated) {
      this.type = `${splitted[2]} ${splitted[3]}`;
      this.field = splitted[4];
    }
    if (!isMap && !isOptional && !isRepeated) {
      this.type = splitted[2];
      this.field = splitted[3];
    }
    this.name = `${this.type} ${this.field}`;
  }
}
