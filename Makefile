
gitadd:
	git remote add github https://github.com/dancheg97/grpc-clicker
	git remote add codeberg https://codeberg.org/dancheg97/grpc-clicker

push:
	git push
	git push github
	git push codeberg

install:
	sudo npm install -g @vscode/vsce && sudo npm install -g yo generator-code
