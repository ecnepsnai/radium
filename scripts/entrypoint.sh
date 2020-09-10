#!/bin/sh
set -e

mkdir -p /radium_data/logs

/radium/radium --data-dir /radium_data -b 0.0.0.0:8080 2>/radium_data/logs/stderr.log