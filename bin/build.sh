#!/usr/bin/env bash
set -eo pipefail

if [[ "$#" -ne 1 ]]; then
  echo "Usage: bin/build.sh <version>"
  exit 1
fi

version=$1

docker build --target release -t ikerry/ctpl:$version .
docker-compose run --rm trivy image --severity HIGH,CRITICAL --exit-code 0 ikerry/ctpl:$version

docker push ikerry/ctpl:$version
docker tag ikerry/ctpl:$version ikerry/ctpl:latest
docker push ikerry/ctpl:latest
