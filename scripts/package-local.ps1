$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distRoot = Join-Path $projectRoot "dist"
$packageRoot = Join-Path $distRoot "local-deployment"
$resolvedProject = [System.IO.Path]::GetFullPath($projectRoot)
$resolvedPackage = [System.IO.Path]::GetFullPath($packageRoot)

if (-not $resolvedPackage.StartsWith($resolvedProject, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "The package directory is outside the project directory."
}

if (Test-Path -LiteralPath $packageRoot) {
  Remove-Item -LiteralPath $packageRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null

$excludedDirectories = @(
  ".git", ".next", ".vercel", "node_modules", "dist", "build",
  "playwright-report", "test-results", ".codex-logs"
)
$excludedFiles = @(".env", ".env.local", ".env.supabase.local")

$robocopyArgs = @(
  $projectRoot,
  $packageRoot,
  "/E", "/R:1", "/W:1", "/NFL", "/NDL", "/NJH", "/NJS", "/NP",
  "/XD"
) + $excludedDirectories + @("/XF") + $excludedFiles + @("*.log")

& robocopy @robocopyArgs | Out-Null
if ($LASTEXITCODE -ge 8) {
  throw "Failed to copy deployment files. Robocopy exit code: $LASTEXITCODE"
}

# Root-level screenshots are local QA artifacts. Real website media lives in public/.
Get-ChildItem -LiteralPath $packageRoot -File | Where-Object {
  $_.Extension -in ".png", ".jpg", ".jpeg", ".webp", ".mp4"
} | Remove-Item -Force

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path $distRoot "tk-classic-local-$stamp.zip"
Compress-Archive -Path (Join-Path $packageRoot "*") -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "Local deployment package created: $zipPath" -ForegroundColor Green
