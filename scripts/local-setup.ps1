$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js was not found. Install Node.js 24 LTS first."
}

if (-not (Test-Path -LiteralPath ".env.local")) {
  Copy-Item -LiteralPath "config\local.env.example" -Destination ".env.local"
  Write-Host "Created .env.local. Fill in the Supabase, Resend, and database variables, then run npm run local:setup again." -ForegroundColor Yellow
  exit 1
}

npm.cmd ci
npm.cmd run lint
npm.cmd run build

Write-Host "Local setup completed. Run npm run local:start and open http://127.0.0.1:3011" -ForegroundColor Green
