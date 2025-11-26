#!/bin/bash
cd "$(dirname "$0")" || exit
cd glow_custom || exit
rm ~/drive/amazfitwatchfases/active2/custom.zip
zip -r ~/drive/amazfitwatchfases/active2/custom.zip ./*
