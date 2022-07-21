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

	first := files[0].Name()
	second := files[1].Name()

	if strings.HasSuffix(first, ".css") {
		err = os.Rename(in+first, in+`styles.css`)
		if err != nil {
			panic(err)
		}
	}
	if strings.HasSuffix(second, ".js") {
		err = os.Rename(in+second, in+`main.js`)
		if err != nil {
			panic(err)
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
