import { Installer } from "./installer";
import * as fs from "fs";

test(`getLink`, () => {
  const installer = new Installer();
  const link = installer.getDownloadLink();
  expect(link).toBe(
    `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_windows_x86_64.zip`
  );
});

test(`download`, async () => {
  const testPath = `./src/grpcurl/test_grpcurl.zip`;
  const installer = new Installer();
  const link = installer.getDownloadLink();
  const res = await installer.download(link!, testPath);
  expect(res).toBeTruthy();
  fs.rm(testPath, () => {});
});

test(`unzip`, async () => {
  const testFile = `./src/grpcurl/unzip.zip`;
  const testDir = `./src/grpcurl/somedir`;
  const installer = new Installer();
  const link = installer.getDownloadLink();
  const dwnld = await installer.download(link!, testFile);
  const rez = await installer.unzip(testFile, testDir);
  expect(rez).toBeTruthy();
  fs.rm(testFile, () => {});
  fs.rm(testDir + `/grpcurl.exe`, () => {});
  fs.rm(testDir + `/LICENSE`, () => {});
});
