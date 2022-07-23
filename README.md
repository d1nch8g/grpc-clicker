# <p  align="center" style="font-family:courier;font-size:180%" size=212px> gRPC Clicker </p>

<p align="center">
<img align="left" style="padding: 10px"  height="238px" src="images/view.svg" /> 
</p>

[![Generic badge](https://img.shields.io/badge/LICENSE-MIT-red.svg)](https://github.com/Dancheg97/grpclicker_vscode/blob/main/LICENSE)
[![Generic badge](https://img.shields.io/badge/VSCode-marketplace-blue.svg)]()
[![Generic badge](https://img.shields.io/badge/GitHub-repository-orange.svg)](https://github.com/Dancheg97/grpclicker_vscode)
[![Generic badge](https://img.shields.io/badge/VERSION-0.0.1-cyan.svg)]()
[![Generic badge](https://img.shields.io/badge/DONATIONS-nano-green.svg)]()

This extension provides ability to execute gRPC calls from VSCode, using [`grpcurl`](https://github.com/fullstorydev/grpcurl) under the hood.

Extension is currently in _alpha_ stage, so it might feel a bit buggy. Contributing is highly appreciated, any extension improvements will be included as fast as possible.

## Functionality:

Extension provides following functionality:

- execute `gRPC` calls from `VSCode`
- view comlpete proto definition with field, message and service description
- easily save and switch between proto hosts
- add metadata to request, enable and disable it with one click

## Get started

1. Open extension on side panel activity bar
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/1.png =250px)
2. Add `proto` file definition
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/2.png =250px)
3. Add `host` for gRPC calls
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/3.png =250px)
4. Add request `metadata` if required (enabled is marked with blue)
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/4.png =250px)
5. Click on the call you want to execute in `proto` schema explorer
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/5.png =250px)
6. Paste message you want to send as json
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/6.png =250px)
7. Execute call
   ![](https://raw.githubusercontent.com/Dancheg97/grpclicker_vscode/main/docs/7.png =250px)
