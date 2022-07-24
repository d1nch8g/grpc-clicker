install:
	npm i
	npm i --prefix webview

compile:
	npm run build --prefix webview
	go run mover.go

build:
	vsce package