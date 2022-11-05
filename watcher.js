const { time } = require("console");
const fs = require("fs");
const execSync = require("child_process").execSync;
const path = require("path");

// Watcher configurations
const webviewsFolder = `webviews`;
const webviews = [`source`, `call`];
const distFolder = `dist`;
const tkSource = `node_modules/@vscode/webview-ui-toolkit/dist/`;
const tkDest = `dist/tk`;
const npmBuildCommand = `npm run build --prefix ` + webviewsFolder;
const webviewAssets = `dist/assets`;

// Prepare necessary folders and load all packages
execSync(`npm i`, { encoding: "utf-8" });
if (!fs.existsSync(distFolder)) {
  fs.mkdirSync(distFolder);
}
webviews.forEach((webview) => {
  execSync(`npm i --prefix ${webviewsFolder}/${webview}`, {
    encoding: "utf-8",
  });
});

// Copy vscode-webview-toolkit contents to dist folder

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

fs.rmSync(tkDest, { recursive: true, force: true });
copyRecursiveSync(tkSource, tkDest);

// Single operation of webview rebuild process:

var rebuild = async function (webviewFolder) {
  const webviewRoot = `${webviewsFolder}/${webviewFolder}`;
  const webviewSrc = `${webviewRoot}/${webviewAssets}/`;
  const webviewDstJs = `${distFolder}/${webviewFolder}.js`;
  const webviewDstCss = `${distFolder}/${webviewFolder}.css`;

  execSync(`${npmBuildCommand} ${webviewRoot}`, { encoding: "utf-8" });
  const files = fs.readdirSync(webviewSrc);
  for (const file of files) {
    if (file.endsWith(`.js`)) {
      fs.renameSync(webviewSrc + file, webviewDstJs);
    }
    if (file.endsWith(`.css`)) {
      fs.renameSync(webviewSrc + file, webviewDstCss);
    }
  }

  const fileBuffer = fs.readFileSync(webviewDstJs);
  const dump = fs.openSync(webviewDstJs, "w+");
  const insert = Buffer.from("const vscode = acquireVsCodeApi();");
  fs.writeSync(dump, insert, 0, insert.length, 0);
  fs.writeSync(dump, fileBuffer, 0, fileBuffer.length, insert.length);
  fs.close(dump);
};

// Watch operation for single webview instance

// Launch watchers for all of

let count = 1;
rebuild();
console.log("\x1b[32m%s\x1b[0m", "Rebuilt webview for vscode: " + count);
let lastrebuild = performance.now();
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
