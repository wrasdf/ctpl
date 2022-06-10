#! /bin/bash
set -e

VERSION=$1
IMAGE=ikerry/ctpl

docker buildx build \
    --platform linux/amd64 \
    --target release \
    --tag ikerry/ctpl:$VERSION .

docker push ikerry/ctpl:$VERSION