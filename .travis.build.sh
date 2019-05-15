#!/bin/bash
source .travis.env.sh

echo Building k-teleray $VERSION with Krawler $KRAWLER_BRANCH

# Build image
docker build --build-arg KRAWLER_BRANCH=$KRAWLER_BRANCH -f dockerfile -t kalisio/k-teleray .
docker tag kalisio/k-teleray kalisio/k-teleray:$VERSION

# Push the built images to Docker hub
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker push kalisio/k-teleray:$VERSION