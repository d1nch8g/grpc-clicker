build:
	npm run build --prefix webview
	go run mover.go

run:
	npm run dev --prefix webview

publish:
	vsce package
	vsce publish