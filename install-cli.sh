#!/bin/bash
set -e

CLI_URL="https://app-updates.agilebits.com/product_history/CLI2"

if [ "$OP_CLI_VERSION" == "latest" ]; then
    OP_CLI_VERSION="v$(curl -s $CLI_URL | awk -v RS='<h3>|</h3>' 'NR % 2 == 0 {gsub(/[[:blank:]]+/, ""); gsub(/<span[^>]*>|<\/span>|[\r\n]+/, ""); gsub(/&nbsp;.*$/, ""); if (!non_beta && !/beta/){print; non_beta=1;}}')"
elif [ "$OP_CLI_VERSION" == "latest-beta" ]; then
    OP_CLI_VERSION="v$(curl -s $CLI_URL | awk -v RS='<h3>|</h3>' 'NR % 2 == 0 {gsub(/[[:blank:]]+/, ""); gsub(/<span[^>]*>|<\/span>|[\r\n]+/, ""); gsub(/&nbsp;.*$/, ""); if (!beta && /beta/){print; beta=1;}}')"
else
    OP_CLI_VERSION="v$OP_CLI_VERSION"
fi

# Install op-cli
install_op_cli() {
    OP_INSTALL_DIR="$(mktemp -d)"
    if [[ ! -d "$OP_INSTALL_DIR" ]]; then
        echo "Install dir $OP_INSTALL_DIR not found"
        exit 1
    fi
    echo "::debug::OP_INSTALL_DIR: ${OP_INSTALL_DIR}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Get architecture
        ARCH=$(uname -m)
        if [ "$(getconf LONG_BIT)" = 32 ]; then
            ARCH="386"
        elif [ "$ARCH" == "x86_64" ]; then
            ARCH="amd64"
        elif [ "$ARCH" == "aarch64" ]; then
            ARCH="arm64"
        fi

        curl -sSfLo op.zip "https://cache.agilebits.com/dist/1P/op2/pkg/$OP_CLI_VERSION/op_linux_amd64_$OP_CLI_VERSION.zip"
        unzip -od "$OP_INSTALL_DIR" op.zip && rm op.zip
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        curl -sSfLo op.pkg "https://cache.agilebits.com/dist/1P/op2/pkg/$OP_CLI_VERSION/op_apple_universal_$OP_CLI_VERSION.pkg"
        pkgutil --expand op.pkg temp-pkg
        tar -xvf temp-pkg/op.pkg/Payload -C "$OP_INSTALL_DIR"
        rm -rf temp-pkg && rm op.pkg
    fi
    echo "$OP_INSTALL_DIR" >>"$GITHUB_PATH"
}

install_op_cli
