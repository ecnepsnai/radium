#!/bin/sh
set -e

if [[ -z "${VERSION}" ]]; then
    VERSION=${1:?Version required}
fi
export VERSION=${VERSION}

radium_PATH=$(realpath ../)

PRODUCT_NAME=radium
PACKAGE_NAME=radium-${VERSION}

cd ${radium_PATH}
git clean -qxdf
cd ${radium_PATH}/scripts
./install.sh ${VERSION}
cd ${radium_PATH}/static/
rm -rf build/
npx webpack --config webpack.login.production.js
npx webpack --config webpack.app.production.js
cd ${radium_PATH}
rm -rf artifacts/
mkdir -p artifacts/

function build_server() {
    cd ${radium_PATH}/cmd/server
    CGO_ENABLED=0 GOOS=${1} GOARCH=${2} go build -ldflags="-s -w" -o ${3}
    NAME=${PRODUCT_NAME}-${VERSION}_${1}_${2}
    mv ${3} ../../
    cd ../../

    rm -rf ${PACKAGE_NAME}
    mkdir -p ${PACKAGE_NAME}/static
    mkdir -p ${PACKAGE_NAME}/clients
    mv ${3} ${PACKAGE_NAME}
    cp -r static/build ${PACKAGE_NAME}/static
    cp -r artifacts/radiumclient* ${PACKAGE_NAME}/clients
    tar -czf ${NAME}.tar.gz ${PACKAGE_NAME}/
    rm -rf ${PACKAGE_NAME}/
    mv ${NAME}.tar.gz artifacts/
}

for OS in 'linux' 'freebsd' 'openbsd' 'netbsd' 'darwin' 'solaris'; do
    build_server ${OS} amd64 ${PRODUCT_NAME}
done

cd scripts/
./docker.sh ${VERSION}
