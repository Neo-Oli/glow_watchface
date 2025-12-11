#!/bin/bash
cd "$(dirname "$0")" || exit
pnpm run lint
cd glow_custom || exit
path=$HOME/drive/amazfitwatchfaces/active2/custom.zip
rm -f "$path"
zip -r "$path" ./*
