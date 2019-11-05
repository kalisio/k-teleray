#!/bin/bash
source .travis.env.sh

echo Building k-teleray $TAG with Krawler $KRAWLER_TAG

# Build image
docker build --build-arg KRAWLER_TAG=$KRAWLER_TAG -f dockerfile -t kalisio/k-teleray:$TAG .

# Push the built images to Docker hub
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker push kalisio/k-teleray:$TAG
