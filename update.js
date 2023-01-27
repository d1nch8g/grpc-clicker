// Imports and some constant stuff
const execSync = require("child_process").execSync;
var readline = require("readline-sync");
let json = require("./package.json");
var fs = require("fs");

const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Print current and newer versions of grpclicker
const template = `📙 This CLI is intended to update grpc_clicker to newer version 
and package the extension with VSCE.\n`;
console.log(template);

const baseVersion = json.version.substr(0, json.version.lastIndexOf(".") + 1);
const lastNum = json.version.substr(json.version.lastIndexOf(".") + 1);
const lastNumInt = parseInt(lastNum);
const newVersionStr = `${baseVersion}${lastNumInt + 1}`;
console.log(`Current version: ${json.version}`);
console.log(`New version:     ${newVersionStr}\n`);

// Accept text inputs and form changelog message
const change = `List changes for changelog (or leave empty to finish):\n`;
console.log(change);

let changeLogTemplate = `## [${newVersionStr}]\n
> ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}\n\n`;

while (true) {
  const inp = readline.question(``);
  if (inp === ``) {
    break;
  }
  changeLogTemplate += `- ${inp}\n`;
}

console.log(`New changelog message:\n${changeLogTemplate}`);

// Push new message to CHANGELOG.md file
var buf = fs.readFileSync("./CHANGELOG.md");
data = buf.toString();
data = data.split(/\r?\n/);
data.splice(4, 0, changeLogTemplate);
data = data.join("\n");
fs.writeFileSync("./CHANGELOG.md", data);

// Push new version to README.md file
var buf = fs.readFileSync("./README.md");
data = buf.toString();
data = data.replace(json.version, newVersionStr);
fs.writeFileSync("./README.md", data);

// Push new version to package.json file
json.version = newVersionStr;
fs.writeFileSync("./package.json", JSON.stringify(json));

// Build and pack evrything up together
console.log(`Building extension, all sources should be prepared in dist!`);
execSync(`vsce package`);
