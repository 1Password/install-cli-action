#!/bin/bash
set -e

OP_CLI_VERSION="$1"
CLI_URL="https://app-updates.agilebits.com/product_history/CLI2"

if [ "$OP_CLI_VERSION" == "latest" ]; then
    OP_CLI_VERSION="$(curl -s $CLI_URL | awk -v RS='<h3>|</h3>' 'NR % 2 == 0 {gsub(/[[:blank:]]+/, ""); gsub(/<span[^>]*>|<\/span>|[\r\n]+/, ""); gsub(/&nbsp;.*$/, ""); if (!non_beta && !/beta/){print; non_beta=1;}}')"
elif [ "$OP_CLI_VERSION" == "latest-beta" ]; then
    OP_CLI_VERSION="$(curl -s $CLI_URL | awk -v RS='<h3>|</h3>' 'NR % 2 == 0 {gsub(/[[:blank:]]+/, ""); gsub(/<span[^>]*>|<\/span>|[\r\n]+/, ""); gsub(/&nbsp;.*$/, ""); if (!beta && /beta/){print; beta=1;}}')"
fi

if [ "$(op --version)" != "$OP_CLI_VERSION" ]; then
    echo -e "Expected CLI version to be:\n$OP_CLI_VERSION\nBut got:\n$(op --version)"
    exit 1
fi
