#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd "${SCRIPT_DIR}"/..

if [[ -z ${CI+x} ]]; then
    echo "Not running in CI"
    exit 1
fi

if [[ ! -d .venv ]]; then
    python -m venv .venv
fi

# File is not available when shellcheck runs as git hook
# because it's excluded from git.
# shellcheck source=/dev/null
source .venv/bin/activate
pip install -r requirements.dev.txt

if [[ ! -f .env ]]; then
    echo "Setting up environment variables"
    cp .env.sample .env
else
    echo "Environment variables already set up"
fi

./manage.py collect_frontend
./manage.py collectstatic --no-input
