$ErrorActionPreference = "Stop"

$authPath = Join-Path ([Environment]::GetFolderPath("UserProfile")) ".config\21st\auth.json"

if (-not (Test-Path -LiteralPath $authPath)) {
  throw "21st.dev authentication is missing. Run: npx @21st-dev/cli@latest login"
}

$auth = Get-Content -LiteralPath $authPath -Raw | ConvertFrom-Json
$token = [string]$auth.token

if ([string]::IsNullOrWhiteSpace($token)) {
  throw "21st.dev authentication token is empty. Run the 21st.dev login command again."
}

@{ "x-api-key" = $token } | ConvertTo-Json -Compress
