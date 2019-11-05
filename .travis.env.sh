#!/bin/bash

# Build docker with version number only on release
if [[ -z "$TRAVIS_TAG" ]]
then
	export VERSION=latest
	export KRAWLER_TAG=latest
else
	export VERSION=$(node -p -e "require('./package.json').version")
	export KRAWLER_TAG=v$(node -p -e "require('./package.json').peerDependencies['@kalisio/krawler']")
fi