compile:
	npm run build --prefix webview
	go run mover.go

build:
	vsce package