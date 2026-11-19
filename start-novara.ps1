$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url = 'http://localhost:5173'

function Show-LaunchError([string]$message) {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show(
    $message,
    'NOVARA ESTATES did not start',
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
}

function Test-NovaraRunning {
  $health = & curl.exe --fail --silent --max-time 2 "$url/api/health" 2>$null
  if ($LASTEXITCODE -ne 0 -or $health -notmatch '"status"\s*:\s*"ok"') {
    return $false
  }
  $status = & curl.exe --silent --output NUL --write-out '%{http_code}' --max-time 2 $url 2>$null
  return $LASTEXITCODE -eq 0 -and $status -eq '200'
}

try {
  if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Show-LaunchError 'Node.js and npm are required. Install Node.js, then try this shortcut again.'
    exit 1
  }

  if (-not (Test-Path -LiteralPath (Join-Path $root 'node_modules'))) {
    Show-LaunchError "Project dependencies are missing.`r`n`r`nOpen a terminal in:`r`n$root`r`nand run: npm install"
    exit 1
  }

  if (Test-NovaraRunning) {
    Start-Process $url
    exit 0
  }

  $startInfo = New-Object System.Diagnostics.ProcessStartInfo
  $startInfo.FileName = $env:ComSpec
  $startInfo.Arguments = '/c npm run dev'
  $startInfo.WorkingDirectory = $root
  $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Minimized
  $startInfo.UseShellExecute = $true
  $server = [System.Diagnostics.Process]::Start($startInfo)
  $deadline = (Get-Date).AddSeconds(60)

  while ((Get-Date) -lt $deadline) {
    if (Test-NovaraRunning) {
      Start-Process $url
      exit 0
    }

    $server.Refresh()
    if ($server.HasExited) {
      Show-LaunchError "The local server stopped before it was ready.`r`n`r`nCheck that ports 3001 and 5173 are free, then try again."
      exit 1
    }

    Start-Sleep -Seconds 1
  }

  Show-LaunchError "The website did not become ready in 60 seconds.`r`n`r`nCheck the minimized server window for errors, then try again."
  exit 1
} catch {
  Show-LaunchError "Could not start the website.`r`n`r`n$($_.Exception.Message)"
  exit 1
}
