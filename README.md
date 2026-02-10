<!-- Image sourced from https://blog.1password.com/1password-cli-2_0/ -->
<img alt="" role="img" src="https://blog.1password.com/posts/2022/1password-cli-2.0/header.png"/>

<div align="center">
	<h1>1Password CLI - GitHub Action</h1>
	<p>Install the <a href="https://developer.1password.com/docs/cli">1Password CLI</a> to access and manage your 1Password items in your GitHub Action runner.</p>
	<a href="#✨-quickstart">
		<img alt="Get started" src="https://user-images.githubusercontent.com/45081667/226940040-16d3684b-60f4-4d95-adb2-5757a8f1bc15.png" height="37"/>
	</a>
</div>

---

# ✨ Quickstart

To install the latest version of the 1Password CLI: \
(**Note:** `latest` version is installed by default, so you don't need to specify a version.)

```yaml
- name: Install 1Password CLI
  uses: 1password/install-cli-action@v2
```

To install the latest beta version (i.e. `latest-beta`) of the 1Password CLI:

```yaml
- name: Install 1Password CLI
  uses: 1password/install-cli-action@v2
  with:
    version: latest-beta
```

To install a specific version of the 1Password CLI:

```yaml
- name: Install 1Password CLI
  uses: 1password/install-cli-action@v2
  with:
    version: 2.31.1
```

## ⚙️ Supported Runners

You can perform the action on Linux, macOS, and Windows runners.

## 💙 Community & Support

- File an [issue](https://github.com/1Password/install-cli-action/issues) for bugs and feature requests.
- Join the [Developer Slack workspace](https://developer.1password.com/joinslack).
- Subscribe to the [Developer Newsletter](https://1password.com/dev-subscribe/).

## 🔐 Security

1Password requests you practice responsible disclosure if you discover a vulnerability.

Please file requests by sending an email to bugbounty@agilebits.com.
