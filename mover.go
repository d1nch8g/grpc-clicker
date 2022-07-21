package main

import (
	"io/ioutil"
	"log"
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
		log.Fatal(err)
	}

	first := files[0].Name()
	second := files[1].Name()

	if strings.HasSuffix(first, ".css") {
		os.Rename(in+first, in+`styles.css`)
	}
	if strings.HasSuffix(second, ".js") {
		os.Rename(in+second, in+`main.js`)
	}

	os.Remove(out + `main.js`)
	os.Remove(out + `styles.css`)

	os.Rename(in+`main.js`, out+`main.js`)
	os.Rename(in+`styles.css`, out+`styles.css`)
}
