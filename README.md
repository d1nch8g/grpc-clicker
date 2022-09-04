<h2 align="center" style="font-weight: lighter; font-size: 29px">gRPC Clicker</h2>

<p align="center">
<img align="center" style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px;" width="238px" height="238px" src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/images/logo.png" /> 
</p>

[![Generic badge](https://img.shields.io/badge/LICENSE-MIT-red.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/LICENSE)
[![Generic badge](https://img.shields.io/badge/VSCode-marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=Dancheg97.grpc-clicker)
[![Generic badge](https://img.shields.io/badge/GitHub-repo-orange.svg)](https://github.com/Dancheg97/grpclicker_vscode)
[![Generic badge](https://img.shields.io/badge/Changelog-v0.1.7-cyan.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/CHANGELOG.md)
[![Generic badge](https://img.shields.io/badge/Contribute-guide-ff69b4.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/CONTRIBUTE.md)

Extension uses [`grpcurl`](https://github.com/fullstorydev/grpcurl) under the hood, it will be installed automatically with extension.

This extension provides ability to execute gRPC calls from VSCode, using [`grpcurl`](https://github.com/fullstorydev/grpcurl) CLI commands (similarly to docker extension).

Currently in _beta_ stage, so it might feel a bit buggy. Contributing is highly appreciated, any extension improvements will be included as fast as possible.

## Functionality:

Extension provides following functionality:

- Execute `gRPC` calls from `VSCode`
- View schema of your services and messages as a tree in side bar
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
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/proto.gif" height="280px"></p>
2. Add reflect servers and check schema.
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/reflect.gif" height="280px"></p>
3. Add headers to request metadata in `grpcurl` format.
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/headers.gif" height="280px"></p>
4. Restore your requests from history, via single click
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/history.gif" height="280px"></p>
5. Create tests with code, time and content conditions
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/test.gif" height="280px"></p>
6. Export `grpcurl` CLI command snippet for your friends without `vscode` :)
   <p align="left"><img src="https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/snippet.gif" height="280px"></p>

---

## Troubleshooting

Most of the time, command `gRPC Clicker: clean all extension cache` helps to
resolve possible issues.

Otherwise feel welcome to write an issue on github.

## Quick commands

Also you can use vscode command palette commands, to quicker manipulate
different extension capabilities:

![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/commands.png)

---

## Tech stack

This extension is built on top of edge technologies, such as:

- [gRPCurl](https://github.com/fullstorydev/grpcurl) - used for processing of gRPC calls
- [Svelte](https://svelte.dev/) - used for UI in extension webview
- [Memento](https://vshaxe.github.io/vscode-extern/vscode/Memento.html) - local storage of extension
- [JEST](https://jestjs.io/) - used for testing of included parsers
- [vscode-webview-ui-toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit) - used for several webview components

<!--
https://marketplace.visualstudio.com/manage/publishers/dancheg97
-->
