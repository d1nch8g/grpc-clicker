# Change Log

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

## [1.0.5]

> January 20, 2023

- fixed a bug with unsaved proto files
- moved webviews to views folder
- import/export buttons for storage

## [1.0.4]

> December 27, 2022

- fixed plus icon to add new files and collections

## [1.0.3]

> December 27, 2022

- fixed image borders in webview
- made files for proto files selectable from inside webview via button
- proto sources, collections and rpc headrs are now saved in global configuration, to get them shared across multiple workspaces
- fixed bug with icon + to vscode compatible format

## [1.0.2]

> December 6, 2022

- Fixed bug with version cleanup

## [1.0.1]

> December 6, 2022

- Fixed bug that prevented ability to add multiple proto sources from single tab
- Sized initial panels properly
- Fixed descriptions for gitea sources
- Added tabulation for `json area` in call tab

## [1.0.0]

> December 2, 2022

- Fix in storage cleanups on version updates
- Incompatible changes in stored format

## [0.1.9]

> November 24, 2022

- Proto files and reflect servers are united into protos
- New webview for connection tests
- Groups for reflect servers and files
- Names for proto schemas
- Additional adjustments for connections
- Fixes for fonts and sizes in json-s and webviews

## [0.1.8]

> November 12, 2022

- Added option for timeout of recieving schema from reflect proto servers.

## [0.1.7]

> August 30, 2022

- Added quick command to trigger grpc calls for command paletter `call.execute`

## [0.1.6]

> August 30, 2022

- Documentation updated

## [0.1.5]

> August 28, 2022

- Linux&Macos autoinstall of grpcurl bug-fixes

## [0.1.4]

> August 14, 2022

- Added automatic grpcurl installation on extension first load
- Added vertical view to webview when it's too tight
- Removed cache cleanup on updates
- Optimized json parser for webview, using RE
- Removed ability to use docker

## [0.1.3]

> August 9, 2022

- Json syntax highlight!!! Made natively in svelte :/ (don't check how it's done
  if you care about your mental health)
- Headers moved to webview window
- History relevant bug fixes
- Changed default option of import path to path to file dir

## [0.1.1]

> August 9, 2022

- Bug fixes
- Ability to specify import path from any proto file

## [0.1.0]

> August 9, 2022

- Added collections
- Added anility to specify import path

## [0.0.19]

> August 9, 2022

- Added support for protoreflect servers in new treeview

## [0.0.18]

> August 8, 2022

- Moved remove buttons of headers to each specific item
- Moved remove buttons of proto files to each file

## [0.0.17]

> August 8, 2022

- Added ability to call grpcurl dockerized version
- Added cleanup button for request history
- Fixed bug with badly appended metadata to request
- Added settings page for extension with ability to turn on/off some stuff
- Switched to strict typescript mode for ease of development
- Added export button for grpcurl requests

## [0.0.15]

> August 5, 2022

- Added parser for nested proto messages
- Added command to clean extension cache
- Fixed header preprocess for windows platform
- Made better icons for extension
- Fixed error parsing mechanism to get proper codes from gRPC responses
- Stabilized `watcher.js` for ease of contribution

## [0.0.14]

> August 3, 2022

- Fixes in parsing mechanism for requests
- Fixes in caches updates on removal

## [0.0.13]

> August 3, 2022

- Fixes related to message displayed in response
- Storage migration / (as removing old caches) mechanics added

## [0.0.12]

> August 2, 2022

- Added jest for testing
- Removed go and makefile for ease of contribution
- Added script to build and move js sources from webview to extension
- Added time of execution to requests
- Added tags to adresses
- Increased speed of extension activation reducing amount of calls
- Changed parsing mechanism to increase readability of protos

## [0.0.11]

> July 28, 2022

- Fixed toolkit reference

## [0.0.10]

> July 28, 2022

- Changed views mostly to vscode styled inputs
- Added waiter spinner for loading of request
- Added ability to switch host inside webview

## [0.0.9]

> July 26, 2022

- Made responses colorizable due to error/success response in response panel
- Corrected empty request parsing mechanism

## [0.0.8]

> July 25, 2022

- Added request history

## [0.0.7]

> July 24, 2022

- Fixed webview lifecicle, corrected dispose listener in webview
- grpcurl module refactoring
- made host and metadata in webview updatable

## [0.0.6]

> July 24, 2022

- Added caching of input values in input panel
- Corrected metadata on request

## [0.0.5]

> July 24, 2022

- Added tags for search to `package.json`
- Documentation corrections

## [0.0.4]

> July 23, 2022

- Added walkthrow to extension launch

## [0.0.3]

> July 23, 2022

- Fixes in `package.json`
- Fixes in documentation
- Removed async extension initialization
- Fixed host issue on app initialization
- Added request metadata

## [0.0.2]

> July 23, 2022

- Files with authoring and documentation

## [0.0.1]

> July 23, 2022

- Initial release

Extension provides following functionality:

- execute `gRPC` calls from `VSCode`
- view comlpete proto definition with field, message and service description
- easily save and switch between proto hosts
- add metadata to request, enable and disable it with one click
