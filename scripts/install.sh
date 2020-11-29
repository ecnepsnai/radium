#!/bin/bash
set -e

RADIUM_PATH=$(realpath ../)
SCRIPTS_PATH=$(realpath .)
STATIC_DIR=$(realpath ./../static)
COLOR_NC='\033[0m'
COLOR_GREEN='\033[0;32m'
RADIUM_VERSION=${1:-dev}

LOG=${RADIUM_PATH}/radium-install.log
echo "" > ${LOG}

echo -en "Building backend... "
cd ${SCRIPTS_PATH}/codegen/
cbgen -n server -v ${RADIUM_VERSION}
mv *.go ${RADIUM_PATH}/server
cd ${RADIUM_PATH}/
go build -o radium_build
rm radium_build
echo -e "${COLOR_GREEN}Finished${COLOR_NC}"

echo -en "Building frontend... "
cd ${STATIC_DIR}
npm install >> "${LOG}" 2>&1
npx webpack --config webpack.login.development.js >> "${LOG}" 2>&1
npx webpack --config webpack.app.development.js >> "${LOG}" 2>&1
cd ../
echo -e "${COLOR_GREEN}Finished${COLOR_NC}"
