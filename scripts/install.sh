#!/bin/bash
set -e

Radium_PATH=$(realpath ../)
SCRIPTS_PATH=$(realpath .)
STATIC_DIR=$(realpath ./../static)
BUILD_THREADS=$(getconf _NPROCESSORS_ONLN)
COLOR_NC='\033[0m'
COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
Radium_VERSION=${1:-dev}

LOG=${Radium_PATH}/radium-install.log
echo "" > ${LOG}

cd ${SCRIPTS_PATH}/codegen/
cbgen -n server -v ${Radium_VERSION}
mv *.go ${Radium_PATH}/server
cd ${Radium_PATH}/
dep ensure

echo -e "${COLOR_BLUE}[INFO]${COLOR_NC} Building static assets"
cd ${STATIC_DIR}
npm install >> "${LOG}" 2>&1
./install.sh >> "${LOG}" 2>&1
gulp >> "${LOG}" 2>&1
cd ../

echo -e "${COLOR_GREEN}Finished!${COLOR_NC}"
