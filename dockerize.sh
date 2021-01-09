#!/bin/bash
# Substitute mcinali for your docker username
echo 'STOPPING container...'
docker container stop $(docker container ls -al | grep 'mcinali/node-web-app' | awk 'END {print $1}')
echo
echo 'REMOVING container...'
docker container rm $(docker container ls -al | grep 'mcinali/node-web-app' | awk 'END {print $1}')
echo
echo 'DELETING image...'
docker image rm $(docker images | grep 'mcinali/node-web-app' | awk 'END {print $3}')
echo
echo 'DOCKER BUILD INITIATED...'
docker build -t mcinali/node-web-app .
echo
echo
echo 'DOCKER RUN INITIATED...'
docker run -e DB_HOST=host.docker.internal -p 49160:8080 -d mcinali/node-web-app
