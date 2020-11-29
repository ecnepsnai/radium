#!/bin/sh
set -e

if [[ -z "${VERSION}" ]]; then
    VERSION=${1:?Version required}
fi
export VERSION=${VERSION}

RADIUM_ROOT=$(realpath ../)

PRODUCT_NAME=radium
PACKAGE_NAME=radium-${VERSION}

cd ${RADIUM_ROOT}
git clean -qxdf
cd ${RADIUM_ROOT}/scripts
./install.sh ${VERSION}
cd ${RADIUM_ROOT}/static/
rm -rf build/
npx webpack --config webpack.login.production.js
npx webpack --config webpack.app.production.js
cd ${RADIUM_ROOT}
rm -rf artifacts/
mkdir -p artifacts/

function build_server() {
    cd ${RADIUM_ROOT}
    CGO_ENABLED=0 GOOS=${1} GOARCH=${2} go build -ldflags="-s -w" -o ${PRODUCT_NAME}
    NAME=${PRODUCT_NAME}-${VERSION}_${1}_${2}

    rm -rf ${PACKAGE_NAME}
    mkdir -p ${PACKAGE_NAME}/static
    mv ${PRODUCT_NAME} ${PACKAGE_NAME}
    cp -r static/build ${PACKAGE_NAME}/static
    tar -czf ${NAME}.tar.gz ${PACKAGE_NAME}/
    rm -rf ${PACKAGE_NAME}/
    mv ${NAME}.tar.gz artifacts/
}

for ARCH in 'amd64'; do
    for OS in 'linux'; do
        build_server ${OS} ${ARCH}
    done
done

cd scripts/
./docker.sh ${VERSION}
