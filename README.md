# Install 1Password CLI - GitHub Action

This action installs [1Password CLI](https://developer.1password.com/docs/cli) into GitHub Action.

## Examples

To install the latest version (i.e. `latest`) of the 1Password CLI:

```yaml
- name: Install 1Password CLI
  uses: 1Password/install-cli@v1
```

To install the latest beta version (i.e. `latest-beta`) of the 1Password CLI:

```yaml
- name: Install 1Password CLI
  uses: 1Password/install-cli@v1
  with:
    version: latest-beta
```

To install a specific version of the 1Password CLI:

```yaml
- name: Install 1Password CLI
  uses: 1Password/install-cli@v1
  with:
    version: 2.18.0
```

## Supported Runners

You can run the action on Linux and macOS runners. Windows is currently not supported.

## Security

1Password requests you practice responsible disclosure if you discover a vulnerability.

Please file requests via [**BugCrowd**](https://bugcrowd.com/agilebits).

For information about security practices, please visit our [Security homepage](https://bugcrowd.com/agilebits).

## Getting help

If you find yourself stuck, visit our [**Support Page**](https://support.1password.com/) for help.
