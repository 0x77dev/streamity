ARG BASE_IMAGE nvidia/cuda:9.0-cudnn7-devel@sha256:7058e91c8f3dabb14f98825c42bbf61c843ea621c7d9959d354a8e3669195def
FROM ${BASE_IMAGE}

WORKDIR /tmp
RUN apt update -y && apt install -y software-properties-common curl git cmake
RUN add-apt-repository ppa:pypy/ppa -y
RUN apt update -y && apt install -y pypy3 pypy3-dev
RUN rm /usr/bin/python3 && ln $(which pypy3) /usr/bin/python3
RUN curl https://bootstrap.pypa.io/get-pip.py | python3

RUN git clone https://github.com/davisking/dlib.git /tmp/dlib &&\
    cd /tmp/dlib && sed -i 's,forward_algo = forward_best_algo;,//forward_algo = forward_best_algo;,g' dlib/cuda/cudnn_dlibapi.cpp &&\
    python3 setup.py install

RUN python3 -m pip install face_recognition nats-py asyncio
