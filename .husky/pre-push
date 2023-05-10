#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn build
yarn coverage
yarn unimported
yarn lint
yarn folderslint
yarn dry