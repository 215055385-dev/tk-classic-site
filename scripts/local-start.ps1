$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

if (-not (Test-Path -LiteralPath ".env.local")) {
  throw "Missing .env.local. Run npm run local:setup and fill in the environment variables first."
}

$env:PORT = "3011"
npm.cmd run dev
