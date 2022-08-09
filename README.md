<h2 align="center" style="font-weight: lighter; font-size: 29px">gRPC Clicker</h2>

<p align="center">
<img align="center" style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px;" width="238px" height="238px" src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/logo.png" /> 
</p>

[![Generic badge](https://img.shields.io/badge/LICENSE-MIT-red.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/LICENSE)
[![Generic badge](https://img.shields.io/badge/VSCode-marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=Dancheg97.grpc-clicker)
[![Generic badge](https://img.shields.io/badge/GitHub-repo-orange.svg)](https://github.com/Dancheg97/grpclicker_vscode)
[![Generic badge](https://img.shields.io/badge/Changelog-v0.0.18-cyan.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/CHANGELOG.md)
[![Generic badge](https://img.shields.io/badge/Contribute-guide-ff69b4.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/CONTRIBUTE.md)

To get extemsion to work, you need to install [`grpcurl`](https://github.com/fullstorydev/grpcurl), or switch to docker version of application.

This extension provides ability to execute gRPC calls from VSCode, using [`grpcurl`](https://github.com/fullstorydev/grpcurl) CLI under the hood.

Currently in _alpha_ stage, so it might feel a bit buggy. Contributing is highly appreciated, any extension improvements will be included as fast as possible.

## Functionality:

Extension provides following functionality:

- execute `gRPC` calls from `VSCode`
- view comlpete proto definition with field, message and service description
- use extension as builder for grpcurl commands
- easily save and switch between proto hosts
- add metadata to request, enable and disable it with one click
- use docker version to execute grpcurl calls from grpcurl container

---

## Install gRPCurl

You can have full installation guide here [grpcurl](https://github.com/fullstorydev/grpcurl).
CLI commands to install it via:

- go:

```sh
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
```

- homebrew:

```brew
brew install grpcurl
```

- ubuntu

```bash
curl -sSL "https://github.com/fullstorydev/grpcurl/releases/download/v1.8.6/grpcurl_1.8.6_linux_x86_64.tar.gz" | tar -xz -C /usr/local/bin
```

- binaries

Also you can find compiled binaries. Download the binary from the [releases page](https://github.com/fullstorydev/grpcurl/releases).

---

## Get started

1. Open extension on side panel activity bar
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/1.png" height="200px"></p>
2. Add `proto` file definition
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/2.png" height="200px"></p>
3. Add `host` for gRPC calls
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/3.png" height="200px"></p>
4. Add request `metadata` if required (enabled is marked with blue)
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/4.png" height="200px"></p>
5. Click on the call you want to execute in `proto` schema explorer
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/5.png" height="200px"></p>
6. Paste message you want to send as json
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/6.png" height="200px"></p>
7. Execute call
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/7.png" height="200px"></p>

<!--
https://marketplace.visualstudio.com/manage/publishers/dancheg97
-->
