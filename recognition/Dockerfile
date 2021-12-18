ARG BASE_IMAGE=nvcr.io/nvidia/l4t-base:r32.4.4
FROM ${BASE_IMAGE}

# setupenv
ENV DEBIAN_FRONTEND=noninteractive
ENV CUDA_HOME="/usr/local/cuda"
ENV PATH="/usr/local/cuda/bin:${PATH}"
ENV LD_LIBRARY_PATH="/usr/local/cuda/lib64:${LD_LIBRARY_PATH}"
ENV LLVM_CONFIG="/usr/bin/llvm-config-9"
ARG MAKEFLAGS=-j$(nproc) 

RUN printenv

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  python3-pip \
  python3-dev \
  python3-matplotlib \
  build-essential \
  gfortran \
  git \
  cmake \
  curl \
  libopenblas-dev \
  liblapack-dev \
  libblas-dev \
  libhdf5-serial-dev \
  hdf5-tools \
  libhdf5-dev \
  zlib1g-dev \
  zip \
  libjpeg8-dev \
  libopenmpi2 \
  openmpi-bin \
  openmpi-common \
  protobuf-compiler \
  libprotoc-dev \
  llvm-9 \
  llvm-9-dev \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

COPY install_dlib.sh /tmp
RUN bash /tmp/install_dlib.sh

RUN pip3 install --no-cache-dir --verbose face_recognition nats-py asyncio numpy

RUN mkdir /app
COPY *.py /app

CMD python3 .