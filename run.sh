#!/bin/bash
set -e

ROOT=$(pwd)

cd $ROOT
cd scripts/codegen/
cbgen -n server -v dev
mv *.go $ROOT/server
cd $ROOT/
EXE_NAME="radium"
go build -o $EXE_NAME
./$EXE_NAME "$@" --no-schedule
