$CLI_URL = "https://app-updates.agilebits.com/product_history/CLI2"

# Fetch the latest version of 1Password CLI (on stable or beta channel)
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

    return "v$version"
}

# Install op-cli
function Install-OPCLI {
    param(
        [string]$OP_CLI_VERSION
    )

    Write-Host "Installing 1Password CLI version: $OP_CLI_VERSION"

    if ($IsWindows) {
        # Get architecture
        $WIN32_ARCH = (Get-CimInstance Win32_OperatingSystem).OSArchitecture
        switch ($WIN32_ARCH) {
            '64-bit' { $ARCH = 'amd64'; break }
            '32-bit' { $ARCH = '386'; break }
            Default { Write-Error "Sorry, your operating system architecture '$WIN32_ARCH' is unsupported" -ErrorAction Stop }
        }
        $URI="https://cache.agilebits.com/dist/1P/op2/pkg/$OP_CLI_VERSION/op_windows_${ARCH}_$OP_CLI_VERSION.zip"
        Invoke-WebRequest -Uri $URI -OutFile op.zip
        $installDir = Join-Path -Path $env:ProgramFiles -ChildPath '1Password CLI'
        Expand-Archive -Path op.zip -DestinationPath $installDir -Force
        $envMachinePath = [System.Environment]::GetEnvironmentVariable('PATH','machine')
        if ($envMachinePath -split ';' -notcontains $installDir){
            [Environment]::SetEnvironmentVariable('PATH', "$envMachinePath;$installDir", 'Machine')
        }
        Remove-Item -Path op.zip
        Write-Output $installDir | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
    } else {
        Write-Error "Install 1Password CLI GitHub Action isn't supported on this operating system using powershell."
        exit 1
    }

}

# Main action of the script

if ($env:OP_CLI_VERSION -eq "latest") {
    $OP_CLI_VERSION = Get-LatestCLIVersion -VersionType "non_beta"
} elseif ($env:OP_CLI_VERSION -eq "latest-beta") {
    $OP_CLI_VERSION = Get-LatestCLIVersion -VersionType "beta"
} else {
    $OP_CLI_VERSION = "v$env:OP_CLI_VERSION"
}
$OP_CLI_VERSION
#Install-OPCLI -OP_CLI_VERSION $OP_CLI_VERSION
