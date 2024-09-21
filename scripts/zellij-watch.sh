#!/bin/bash

ZSESSION="pizza-watch-all"

SCRIPTPATH="$(
    cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"

cd "$SCRIPTPATH" || exit

if ! command -v zellij >/dev/null 2>&1; then
    echo "zellij could not be found, please install it first"
    exit
fi

if [[ "${ZELLIJ:-UNSET}" == "0" ]]; then
    echo "Starting watchers in new tab"
    zellij action new-tab --layout pizza-watch-all.kdl
else
    if zellij ls | grep $ZSESSION; then
        echo "Session already exists. Remove or manually attach:"
        echo "zellij attach $ZSESSION"
        echo "zellij delete-session $ZSESSION"
    else
        echo "Starting watchers in new zellij session"
        zellij --session $ZSESSION --layout pizza-watch-all.kdl
    fi
fi
