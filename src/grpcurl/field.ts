export class Field {
  public type: string;
  public name: string;
  constructor(line: string) {
    let splitted = line.split(" ");
    if (line.includes("map") && line.includes("<") && line.includes(">")) {
      var key = line.replace("map<", "").replace(",", "");
      var value = line.replace(">", "");
      this.type = `map<${key}, ${value}>`;
      this.name = splitted[4];
    }
    if (line.includes("repeated") || line.includes("optional")) {
      this.type = `${splitted[2]} ${splitted[3]}`;
      this.name = splitted[4];
    } else {
      this.type = splitted[2];
      this.name = splitted[3];
    }
  }
}
