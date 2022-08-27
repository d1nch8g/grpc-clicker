var http = require("https");
var fs = require("fs");

let url =
  "https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_windows_x86_64.zip";
let dest = "./grpcurl.zip";

var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  http.get(url, function (response) {
    response.pipe(file);
    file.on("finish", function () {
      file.close(cb);
    });
  });
};

download(url, dest, () => {
  console.log(`done`);
});
