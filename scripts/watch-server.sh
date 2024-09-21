#!/bin/bash

SCRIPTPATH="$(
    cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"

cd "$SCRIPTPATH/.." || exit

# File is not available when shellcheck runs as git hook
# because it's excluded from git.
# shellcheck source=/dev/null
source venv/bin/activate

./manage.py runserver_plus
