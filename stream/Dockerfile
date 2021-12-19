FROM golang:rc-bullseye

RUN DEBIAN_FRONTEND=non-interactive apt update -y && apt install -y libopencv-dev

RUN mkdir /app
WORKDIR /app
COPY . .

CMD go run main.go