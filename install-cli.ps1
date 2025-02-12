$CLI_URL = "https://app-updates.agilebits.com/product_history/CLI2"

# Fetch the latest version of 1Password CLI (Stable or Beta)
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

        # Find the correct version based on the type requested
        $latestVersion = $versions | Where-Object { $VersionType -eq "beta" -or ($_ -notmatch "beta") } | Select-Object -First 1

        if (-not $latestVersion) {
            Write-Error "No suitable version found for type: $VersionType" -ErrorAction Stop
        }

        return "v$latestVersion"
    } catch {
        Write-Error "Failed to fetch latest version: $_"
        exit 1
    }
}

# Install 1Password CLI
function Install-OPCLI {
    param(
        [string]$OP_CLI_VERSION
    )

    Write-Host "Installing 1Password CLI version: $OP_CLI_VERSION"

    if ($IsWindows) {
        # Get system architecture
        try {
            $WIN32_ARCH = (Get-CimInstance Win32_OperatingSystem).OSArchitecture
        } catch {
            Write-Error "Failed to detect OS architecture: $_"
            exit 1
        }

        switch ($WIN32_ARCH) {
            '64-bit' { $ARCH = 'amd64' }
            '32-bit' { $ARCH = '386' }
            Default { Write-Error "Unsupported OS architecture: '$WIN32_ARCH'"; exit 1 }
        }

        $DownloadUrl = "https://cache.agilebits.com/dist/1P/op2/pkg/$OP_CLI_VERSION/op_windows_${ARCH}_$OP_CLI_VERSION.zip"
        $InstallDir = Join-Path -Path $env:ProgramFiles -ChildPath '1Password CLI'

        try {
            Invoke-WebRequest -Uri $DownloadUrl -OutFile op.zip
            Expand-Archive -Path op.zip -DestinationPath $InstallDir -Force
            Remove-Item -Path op.zip -Force
        } catch {
            Write-Error "Failed to install 1Password CLI: $_"
            exit 1
        }

        # Add install path to system environment variables
        $EnvMachinePath = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine')
        if ($EnvMachinePath -split ';' -notcontains $InstallDir) {
            [Environment]::SetEnvironmentVariable('PATH', "$EnvMachinePath;$InstallDir", 'Machine')
        }

        Write-Output $InstallDir | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
        Write-Host "Installation completed successfully!"
    } else {
        Write-Error "This PowerShell script does not support non-Windows installations."
        exit 1
    }
}

# Main script execution
try {
    if ($env:OP_CLI_VERSION -eq "latest") {
        $OP_CLI_VERSION = Get-LatestCLIVersion -VersionType "non_beta"
    } elseif ($env:OP_CLI_VERSION -eq "latest-beta") {
        $OP_CLI_VERSION = Get-LatestCLIVersion -VersionType "beta"
    } else {
        $OP_CLI_VERSION = "v$env:OP_CLI_VERSION"
    }

    Install-OPCLI -OP_CLI_VERSION $OP_CLI_VERSION
} catch {
    Write-Error "Unexpected error occurred: $_"
    exit 1
}
