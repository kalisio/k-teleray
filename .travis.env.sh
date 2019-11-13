#!/bin/bash

# Define image name
REPO_SLUG="$TRAVIS_REPO_SLUG"
REPO_NAME=${REPO_SLUG#*/}
IMAGE_NAME=docker.pkg.github.com/$REPO_SLUG/$REPO_NAME

# Define image tag
# Use version number only on release
if [[ -z "$TRAVIS_TAG" ]]
then
	export TAG=latest
	export KRAWLER_TAG=latest
else
	export TAG=$(node -p -e "require('./package.json').version")
	export KRAWLER_TAG=v$(node -p -e "require('./package.json').peerDependencies['@kalisio/krawler']")
fi