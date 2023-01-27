import { Installer } from "./installer";
import * as fs from "fs";

test(`getLink`, () => {
  const installer = new Installer();
  const link = installer.getDownloadUrl();
  switch (process.platform) {
    case `win32`:
      expect(link).toBe(
        `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_windows_x86_64.zip`
      );
      return;
    case `darwin`:
      expect(link).toBe(
        `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_osx_x86_64.tar.gz`
      );
      return;
    case `linux`:
      expect(link).toBe(
        `https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_linux_x86_64.tar.gz`
      );
      return;
  }
});

test(`download`, async () => {
  const loadedFile = `./src/grpcurl/_test.zip`;
  const installer = new Installer();
  const link = installer.getDownloadUrl();
  const downloaded = await installer.download(link!, loadedFile);
  expect(downloaded).toBeTruthy();
  fs.rmSync(loadedFile);
});

test(`unzip`, async () => {
  const loadedFile = `./src/grpcurl/_archive.zip`;
  const unzippedDir = `./src/grpcurl/_archive`;
  const installer = new Installer();
  const link = installer.getDownloadUrl();
  await installer.download(link!, loadedFile);

  const unzipped = await installer.unzip(loadedFile, unzippedDir);
  expect(unzipped).toBeTruthy();
  fs.rmSync(unzippedDir, { recursive: true, force: true });
  console.log(`test files removed`);
});
