<h2 align="center" style="font-weight: lighter; font-size: 29px">gRPC Clicker</h2>

<p align="center">
<img align="center" style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px;" width="238px" height="238px" src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/images/logo.png" /> 
</p>

[![Generic badge](https://img.shields.io/badge/LICENSE-MIT-orange.svg)](https://fmnx.su/dancheg97/grpc-clicker/src/branch/main/LICENSE)
[![Generic badge](https://img.shields.io/badge/fmnx-repo-006db0.svg)](https://fmnx.su/dancheg97/grpc-clicker)
[![Generic badge](https://img.shields.io/badge/github-repo-white.svg)](https://github.com/dancheg97/grpc-clicker)
[![Generic badge](https://img.shields.io/badge/codeberg-repo-45a3fb.svg)](https://codeberg.org/dancheg97/grpc-clicker)
[![Generic badge](https://img.shields.io/badge/VSCode-marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=Dancheg97.grpc-clicker)
[![Generic badge](https://img.shields.io/badge/OpenVSX-marketplace-purple.svg)](https://open-vsx.org/extension/Dancheg97/grpc-clicker)

Extension uses [`grpcurl`](https://github.com/fullstorydev/grpcurl) under the hood, it will be installed automatically with extension.

This extension provides ability to execute gRPC calls from VSCode, using [`grpcurl`](https://github.com/fullstorydev/grpcurl) CLI commands.

Github repository is just a mirror, but issues/pull requests are tracked there aswell. Main repo - [fmnx.su](https://fmnx.su/dancheg97/grpc-clicker).

## Functionality:

Extension provides following functionality:

- Execute `gRPC` calls from `VSCode`
- View schema of your services and messages as a tree in a side bar
- Export prepared gRPCurl `CLI` request for executiong from coommand prompt
- Add headers to request
- View full history of requests in side panel
- Create collections with tests of your requests and executete them
- Get generated templates of messages in request tab
- Json highlighting/formatting/validation for requests
- Restore your requests from history, save parameters such as hosts and headers in local storage

---

## Get started

1. Add proto files and navigate across the schema.
   <p align="left"><img src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/proto.gif" ></p>
2. Add reflect servers and check schema.
   <p align="left"><img src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/reflect.gif" ></p>
3. Add headers to request metadata in `grpcurl` format.
   <p align="left"><img src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/headers.gif" ></p>
4. Restore your requests from history, via single click
   <p align="left"><img src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/history.gif" ></p>
5. Create tests with code, time and content conditions
   <p align="left"><img src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/test.gif" ></p>
6. Export `grpcurl` CLI command snippet for your friends without `vscode` :)
   <p align="left"><img src="https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/snippet.gif" ></p>

---

## Troubleshooting

Most of the time, command `gRPC Clicker: clean all extension cache` helps to
resolve possible issues.

Otherwise feel welcome to write an issue in gitea repository.

## Quick commands

Also you can use vscode command palette commands, to quicker manipulate
different extension capabilities:

![](https://fmnx.su/dancheg97/grpc-clicker/raw/branch/main/docs/commands.png)

---

## Tech stack

This extension is built on top of edge technologies, such as:

- [grpcurl](https://github.com/fullstorydev/grpcurl) - used for processing of gRPC calls
- [svelte](https://svelte.dev/) - used for UI in extension webview
- [vscode-webview-ui-toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit) - used for several webview components

<!--
https://marketplace.visualstudio.com/manage/publishers/dancheg97
https://open-vsx.org/user-settings/extensions
https://open-vsx.org/extension/Dancheg97/grpc-clicker
-->
