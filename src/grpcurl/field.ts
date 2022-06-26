export class Field {
  public type: string;
  public field: string;
  public name: string;
  constructor(line: string) {
    let splitted = line.split(" ");
    if (line.includes("Map") && line.includes("<") && line.includes(">")) {
      var key = line.replace("map<", "").replace(",", "");
      var value = line.replace(">", "");
      this.type = `map<${key}, ${value}>`;
      this.field = splitted[4];
    }
    if (line.includes("repeated") || line.includes("optional")) {
      this.type = `${splitted[2]} ${splitted[3]}`;
      this.field = splitted[4];
    } else {
      this.type = splitted[2];
      this.field = splitted[3];
    }
    this.name = `${this.type} ${this.field}`;
  }
}
