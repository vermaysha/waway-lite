#!/usr/bin/env bash

set -e

rm -rf build
mkdir -p ./build

echo "Building main file"
./node_modules/.bin/tsc --build

echo "Copying package.json"
cp package.json build/

echo "Copying package-lock.json"
cp package-lock.json build/

echo "Build complete\nRun the following commands to start the server in production\n\ncd build\nnpm ci --production\nnode server.js\n"
