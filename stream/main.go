package main

import (
	"encoding/json"
	"fmt"
	_ "image/jpeg"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/hybridgroup/mjpeg"
	"github.com/nats-io/nats.go"
	"gocv.io/x/gocv"
)

type Camera struct {
	Id  string `json:"id"`
	Src string `json:"src"`
}

func main() {
	var wg sync.WaitGroup
	classifier := gocv.NewCascadeClassifier()
	defer classifier.Close()

	if !classifier.Load("data/haarcascade_frontalface_default.xml") {
		fmt.Println("Error reading cascade file: data/haarcascade_frontalface_default.xml")
		return
	}

	nc, err := nats.Connect("nats://localhost:4222")
	if err != nil {
		panic(err)
	}

	msg, err := nc.Request("api.camera.get", []byte("get"), 10*time.Second)
	if err != nil {
		panic(err)
	}

	var cameras []Camera
	json.Unmarshal(msg.Data, &cameras)

	for i := 0; i < len(cameras); i++ {
		var camera = cameras[i]
		wg.Add(1)
		s := mjpeg.NewStream()
		http.Handle("/"+camera.Id, s)
		go stream(&wg, camera.Id, camera.Src, nc, s, &classifier)
	}

	go listen()
	wg.Wait()
}

func listen() {
	log.Fatal(http.ListenAndServe("0.0.0.0:1025", nil))
}

func detect(id string, nc *nats.Conn, img gocv.Mat, classifier *gocv.CascadeClassifier) {
	rects := classifier.DetectMultiScale(img)

	// FIXME: always recognizes a face
	if len(rects) > 0 {
		buf, _ := gocv.IMEncode(".jpg", img)
		nc.Publish("recognition.frame."+id, buf.GetBytes())
	}
}

func stream(wg *sync.WaitGroup, id string, src string, nc *nats.Conn, s *mjpeg.Stream, classifier *gocv.CascadeClassifier) {
	defer wg.Done()
	fmt.Printf("Starting %v\n", id)

	cap, _ := gocv.OpenVideoCapture(src)
	img := gocv.NewMat()
	defer cap.Close()

	for {
		frame := cap.Read(&img)
		if frame {
			detect(id, nc, img, classifier)
			buf, _ := gocv.IMEncode(".jpg", img)
			s.UpdateJPEG(buf.GetBytes())
			buf.Close()
		}
	}
}
