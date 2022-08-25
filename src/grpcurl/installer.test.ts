import path = require("path");
import fs = require("fs");
import { Installer } from "./installer";

test(`getLink`, () => {
  const installer = new Installer();
  const link = installer.getDownloadLink();
  expect(link).toBe(
    `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_windows_x86_64.zip`
  );
});

test(`download`, async () => {
  const installer = new Installer();
  const link = installer.getDownloadLink();
  const res = await installer.download(link!, `grpcurl.exe`);
  expect(res).toBeTruthy();
});
