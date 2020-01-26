#!/bin/bash

rm -f /data2/radium/data/logs/stderr.log
/data2/radium/current/radium -d /data2/radium/data 2>/data2/radium/data/logs/stderr.log
