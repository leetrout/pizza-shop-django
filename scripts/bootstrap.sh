#!/usr/bin/env bash

set -euo pipefail

if ! command -v asdf &> /dev/null; then
    echo "asdf is not installed. Please install asdf first."
    exit 1
fi

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "${SCRIPT_DIR}"/..

echo "Install asdf plugins"
set +e
PLUGINS=$(cut -d' ' -f1 .tool-versions)
for x in $PLUGINS; do asdf plugin add "$x"; done
set -e

echo "Installing asdf packages"
asdf install

echo "Configuring pre-commit"
pre-commit install
pre-commit install-hooks

echo "Setting up python environment"
python3 -m venv venv
# File is not available when shellcheck runs
# because it is gitignored and shellcheck is run via pre-commit
# shellcheck source=/dev/null
source venv/bin/activate
pip install -r requirements.dev.txt

if [[ ! -f .env ]]; then
    echo "Setting up environment variables"
    cp .env.sample .env
else
    echo "Environment variables already set up"
fi

echo "Setting up frontend environment"
cd apps/pizza_shop/frontend
npm install
