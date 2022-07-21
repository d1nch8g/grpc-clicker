package main

import (
	"io/ioutil"
	"log"
	"os"
	"strings"
)

func main() {
	files, err := ioutil.ReadDir("dist/assets")
	if err != nil {
		log.Fatal(err)
	}

	first := files[0].Name()
	second := files[1].Name()

	if strings.HasSuffix(first, ".css") {
		os.Rename(`dist/assets/`+first, `dist/assets/styles.css`)
	}
	if strings.HasSuffix(second, ".js") {
		os.Rename(`dist/assets/`+second, `dist/assets/main.js`)
	}

	
}
