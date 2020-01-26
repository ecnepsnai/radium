#!/bin/bash
set -e

ROOT=$(pwd)

cd $ROOT
cd scripts/codegen/
cbgen -n server -v dev
mv *.go $ROOT/server
cd $ROOT/
EXE_NAME="radium_$(uname)_$(uname -m)"
go build -o $EXE_NAME
./$EXE_NAME "$@" --no-schedule
