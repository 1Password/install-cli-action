$OP_CLI_VERSION = $args[0]
$CLI_URL = "https://app-updates.agilebits.com/product_history/CLI2"

# Function to fetch the latest 1Password CLI version
function Get-LatestCLIVersion {
    param(
        [ValidateSet("beta", "non_beta")]
        [string]$VersionType
    )

    try {
        $html = Invoke-WebRequest -Uri $CLI_URL -UseBasicParsing

        $versions = $html.Content |
            Select-String -Pattern '(?ms)<h3>(.*?)<\/h3>' -AllMatches |
                ForEach-Object { $_.Matches.Groups[1].Value -replace '\s+', '' -replace '<span.*?>|<\/span>|&nbsp;.*', '' }

        # Find the latest version based on the requested type
        $latestVersion = $versions | Where-Object { $VersionType -eq "beta" -or ($_ -notmatch "beta") } | Select-Object -First 1

        if (-not $latestVersion) {
            Write-Error "No suitable version found for type: $VersionType" -ErrorAction Stop
        }

        return $latestVersion
    } catch {
        Write-Error "Failed to fetch latest version: $_"
        exit 1
    }
}

# Determine the desired 1Password CLI version
if ($OP_CLI_VERSION -eq "latest") {
    $OP_CLI_VERSION = Get-LatestCLIVersion -VersionType "non_beta"
} elseif ($OP_CLI_VERSION -eq "latest-beta") {
    $OP_CLI_VERSION = Get-LatestCLIVersion -VersionType "beta"
}

# Check if 1Password CLI is installed before running the version check
if (-Not (Get-Command op -ErrorAction SilentlyContinue)) {
    Write-Error "1Password CLI ('op') is not installed or not found in PATH."
    exit 1
}

# Compare the installed version with the expected version
$installedVersion = op --version
if ($installedVersion -ne $OP_CLI_VERSION) {
    Write-Output "Expected CLI version: $OP_CLI_VERSION"
    Write-Output "But found installed version: $installedVersion"
    exit 1
}
