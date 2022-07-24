package main

import (
	"io/ioutil"
	"os"
	"strings"
)

const (
	in  = `webview/dist/assets/`
	out = `dist/`
)

// ext manage page: https://marketplace.visualstudio.com/manage/publishers/dancheg97

func main() {
	files, err := ioutil.ReadDir(in)
	if err != nil {
		panic(err)
	}

	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".css") {
			err = os.Rename(in+file.Name(), in+`styles.css`)
		}
		if strings.HasSuffix(file.Name(), ".js") {
			err = os.Rename(in+file.Name(), in+`main.js`)
		}
	} remove adresses to hosts evrywhere

	os.Mkdir(`dist`, os.ModePerm)

	os.Remove(out + `main.js`)
	os.Remove(out + `styles.css`)

	err = os.Rename(in+`main.js`, out+`main.js`)
	if err != nil {
		panic(err)
	}
	err = os.Rename(in+`styles.css`, out+`styles.css`)
	if err != nil {
		panic(err)
	}

	script, err := ioutil.ReadFile(out + `main.js`)
	if err != nil {
		panic(err)
	}

	script = append([]byte(`const vscode = acquireVsCodeApi();`), script...)
	os.Remove(out + `main.js`)
	ioutil.WriteFile(out+`main.js`, script, os.ModePerm)
}
