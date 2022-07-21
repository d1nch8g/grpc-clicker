package main

import (
	"io/ioutil"
	"os"
	"strings"
)

const (
	in  = `webview/dist/assets/`
	out = `media/`
)

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
	}

	os.Mkdir(`media`, os.ModePerm)

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
}
