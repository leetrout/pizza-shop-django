#!/bin/bash

SCRIPTPATH="$(
    cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"

cd "$SCRIPTPATH/../apps/pizza_shop/frontend" || exit

npm run dev
