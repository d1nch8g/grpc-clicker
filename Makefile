

devend:
	sudo npm install -g @vscode/vsce && sudo npm install -g yo generator-code

run:
	npm run watch &
	node daemon.js

package:
	node update.js
