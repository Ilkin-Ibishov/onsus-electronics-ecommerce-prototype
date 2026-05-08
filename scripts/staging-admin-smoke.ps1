param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl,

  [string]$AdminEmail = "",
  [string]$AdminPassword = ""
)

$ErrorActionPreference = "Stop"

function Write-Check($name, $ok, $detail) {
  $status = if ($ok) { "PASS" } else { "FAIL" }
  Write-Output ("[{0}] {1} - {2}" -f $status, $name, $detail)
}

function Invoke-Json($method, $url, $body = $null, $session = $null) {
  $params = @{
    Method      = $method
    Uri         = $url
    UseBasicParsing = $true
    Headers     = @{ "Content-Type" = "application/json" }
  }
  if ($body -ne $null) {
    $params["Body"] = ($body | ConvertTo-Json -Depth 10)
  }
  if ($session -ne $null) {
    $params["WebSession"] = $session
  }
  return Invoke-WebRequest @params
}

$base = $BaseUrl.TrimEnd("/")
$failed = $false

Write-Output ("Smoke test target: {0}" -f $base)

# 1) Unauthenticated me
try {
  $meRes = Invoke-Json "GET" "$base/api/auth/me"
  $me = $meRes.Content | ConvertFrom-Json
  $ok = ($me.authenticated -eq $false -and $me.role -eq "viewer")
  Write-Check "Unauthenticated /api/auth/me" $ok $meRes.Content
  if (-not $ok) { $failed = $true }
} catch {
  Write-Check "Unauthenticated /api/auth/me" $false $_.Exception.Message
  $failed = $true
}

# 2) Unauthenticated write should fail
try {
  Invoke-Json "POST" "$base/api/categories" @{ name = "smoke"; slug = "smoke"; sortOrder = 999 } | Out-Null
  Write-Check "Unauthenticated POST /api/categories" $false "Unexpected success"
  $failed = $true
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  $ok = ($status -eq 403)
  Write-Check "Unauthenticated POST /api/categories" $ok ("status={0}" -f $status)
  if (-not $ok) { $failed = $true }
}

# 3) Optional authenticated checks
if ($AdminEmail -and $AdminPassword) {
  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  try {
    $loginRes = Invoke-Json "POST" "$base/api/auth/login" @{
      email    = $AdminEmail
      password = $AdminPassword
    } $null
    $loginOk = ($loginRes.StatusCode -eq 200)
    Write-Check "POST /api/auth/login" $loginOk ("status={0}" -f $loginRes.StatusCode)
    if (-not $loginOk) { $failed = $true }
  } catch {
    Write-Check "POST /api/auth/login" $false $_.Exception.Message
    $failed = $true
  }

  try {
    $meAuthRes = Invoke-Json "GET" "$base/api/auth/me" $null $session
    $meAuth = $meAuthRes.Content | ConvertFrom-Json
    $ok = ($meAuth.authenticated -eq $true -and ($meAuth.role -eq "admin" -or $meAuth.role -eq "editor"))
    Write-Check "Authenticated /api/auth/me" $ok $meAuthRes.Content
    if (-not $ok) { $failed = $true }
  } catch {
    Write-Check "Authenticated /api/auth/me" $false $_.Exception.Message
    $failed = $true
  }

  try {
    $catRead = Invoke-Json "GET" "$base/api/categories" $null $session
    $ok = ($catRead.StatusCode -eq 200)
    Write-Check "Authenticated GET /api/categories" $ok ("status={0}" -f $catRead.StatusCode)
    if (-not $ok) { $failed = $true }
  } catch {
    Write-Check "Authenticated GET /api/categories" $false $_.Exception.Message
    $failed = $true
  }
} else {
  Write-Output "[INFO] Skipping authenticated checks (no AdminEmail/AdminPassword provided)."
}

if ($failed) {
  Write-Output "Smoke test result: FAIL"
  exit 1
}

Write-Output "Smoke test result: PASS"
exit 0
