#!/bin/bash
set -e

VERSION=${1:?Version required}
DOCKER_CMD=${DOCKER:-"docker"}

rm -rf Docker
mkdir Docker
cp Dockerfile Docker/
cp entrypoint.sh Docker/entrypoint.sh
cd Docker

# Add service
cp ../../artifacts/radium-${VERSION}_linux_amd64.tar.gz .
tar -xzf radium-${VERSION}_linux_amd64.tar.gz
rm radium-${VERSION}_linux_amd64.tar.gz
mv radium-${VERSION} radium
${DOCKER_CMD} build -t radium:${VERSION} .
cd ../
rm -rf Docker
${DOCKER_CMD} save radium:${VERSION} > radium-${VERSION}_docker.tar
gzip radium-${VERSION}_docker.tar
mv radium-${VERSION}_docker.tar.gz ../artifacts
