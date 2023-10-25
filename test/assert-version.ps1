$OP_CLI_VERSION = $args[0]
$CLI_URL = "https://app-updates.agilebits.com/product_history/CLI2"

function Get-LatestCLIVersion {
    param(
        [string]$VersionType
    )

    $html = Invoke-WebRequest -Uri $CLI_URL

    $version = $html.Content |
        Select-String -Pattern '(?ms)<h3>(.*?)<\/h3>' -AllMatches |
            ForEach-Object { $_.Matches } |
                ForEach-Object { $_.Groups[1].Value } |
                    ForEach-Object { $_ -replace '\s+', '' -replace '<span.*?>|<\/span>|&nbsp;.*', '' } |
                        ForEach-Object {
                            # If we're looking for the latest beta version, we need to print the first match whether it contains "beta" or not
                            # If we're looking for the latest stable version, we need to print the first match that doesn't contain "beta"
                            if (($VersionType -eq "beta") -or ($VersionType -eq "non_beta" -and $_ -notmatch "beta")) {
                                $_
                            }} |
                            Select-Object -First 1

    return $version
}

if ($OP_CLI_VERSION -eq "latest") {
    $OP_CLI_VERSION = Get-LatestCliVersion -VersionType "non_beta"
}
elseif ($OP_CLI_VERSION -eq "latest-beta") {
    $OP_CLI_VERSION = Get-LatestCliVersion -VersionType "beta"
}

if ((op --version) -ne $OP_CLI_VERSION) {
    Write-Output "Expected CLI version to be:`n$OP_CLI_VERSION`nBut got:`n$(op --version)"
    exit 1
}