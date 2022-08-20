const { time } = require("console");
const fs = require("fs");
const execSync = require("child_process").execSync;
const path = require("path");

var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      if (!childItemName.endsWith(".ts")) {
        copyRecursiveSync(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

var rebuild = function () {
  const output = execSync("npm run build --prefix webview", {
    encoding: "utf-8",
  });

  if (!fs.existsSync(`dist`)) {
    fs.mkdirSync(`dist`);
  }

  const files = fs.readdirSync(`webview/dist/assets/`);
  for (const file of files) {
    if (file.endsWith(`.js`)) {
      fs.renameSync(
        "webview/dist/assets/" + file,
        "dist/main.js",
        function (err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully renamed - AKA moved!");
        }
      );
    }
    if (file.endsWith(`.css`)) {
      fs.renameSync(
        "webview/dist/assets/" + file,
        "dist/styles.css",
        function (err) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully renamed - AKA moved!");
        }
      );
    }
  }

  const data = fs.readFileSync("dist/main.js");
  const fd = fs.openSync("dist/main.js", "w+");
  const insert = Buffer.from("const vscode = acquireVsCodeApi();");
  fs.writeSync(fd, insert, 0, insert.length, 0);
  fs.writeSync(fd, data, 0, data.length, insert.length);
  fs.close(fd, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.rmSync(`dist/tk/`, { recursive: true, force: true });

  try {
    copyRecursiveSync(
      `node_modules/@vscode/webview-ui-toolkit/dist/`,
      `dist/tk/`
    );
  } catch (e) {
    console.log(e);
  }
};

let count = 1;
rebuild();
console.log("\x1b[32m%s\x1b[0m", "Rebuilt webview for vscode: " + count);
let lastrebuild = performance.now();
let waitMsRebuild = 4000;
if (process.platform === "win32") {
  waitMsRebuild = 100;
}
fs.watch("webview/src", function (event, filename) {
  if (performance.now() - lastrebuild > 300) {
    count += 1;
    try {
      rebuild();
      console.log("\x1b[32m%s\x1b[0m", "Rebuilt webview for vscode: " + count);
      lastrebuild = performance.now();
    } catch (e) {
      console.log("\x1b[31m%s\x1b[0m", "Error rebuilding webview: " + e);
    }
  }
});
