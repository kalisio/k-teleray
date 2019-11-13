#!/bin/bash
source .travis.env.sh

# Source the environment to define Krawler and image versions
source .travis.env.sh
echo Building $IMAGE_NAME:$IMAGE_TAG with Krawler-$KRAWLER_TAG

# Build the image
docker build --build-arg KRAWLER_TAG=$KRAWLER_TAG -f dockerfile -t $IMAGE_NAME:$IMAGE_TAG .
# Publish the image
docker push $IMAGE_NAME:$IMAGE_TAG

