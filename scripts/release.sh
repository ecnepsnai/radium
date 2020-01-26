#!/bin/sh
set -e

Radium_PATH=$(realpath ../)
VERSION=${1:?Version required}
PRODUCT_NAME=radium
PACKAGE_NAME=Radium-${VERSION}

cd ${Radium_PATH}
git clean -qxdf
rm -rf artifacts/
cd scripts/
./install.sh ${VERSION}
cd ${Radium_PATH}/static/
gulp release
cd build
for FILE in $(find . -name '*.html'); do
    [ -e "$FILE" ] || continue
    perl -pi -e "s,radiumdev,radium${VERSION},g" ${FILE}
done
cd static/js
perl -pi -e "s,radiumdev,radium${VERSION},g" ng.js
cd ${Radium_PATH}
mkdir artifacts

function build() {
    GOOS=${1} GOARCH=${2} go build -o ${3}
    NAME=${PRODUCT_NAME}-${VERSION}_${1}_${2}

    rm -rf ${PACKAGE_NAME}
    mkdir -p ${PACKAGE_NAME}/static
    mkdir -p ${PACKAGE_NAME}/redist
    mv ${3} ${PACKAGE_NAME}
    cp -r static/build ${PACKAGE_NAME}/static
    cp -r scripts/redist/* ${PACKAGE_NAME}/redist/
    perl -pi -e "s,&&VERSION&&,${VERSION},g" ${PACKAGE_NAME}/redist/nginx.conf
    zip -qr ${NAME}.zip ${PACKAGE_NAME}/
    rm -rf ${PACKAGE_NAME}/
    mv ${NAME}.zip artifacts/
}

build linux amd64 ${PRODUCT_NAME}
build darwin amd64 ${PRODUCT_NAME}
build windows amd64 ${PRODUCT_NAME}.exe
