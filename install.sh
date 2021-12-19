#!/bin/bash

function compose {
  if [ $(arch) == "aarch64" ]; then
    docker run -it -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/bind docker/compose -f /bind/docker-compose.jetson.yaml $*
  fi

  docker-compose $*
}

compose up
