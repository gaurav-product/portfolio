# Gaurav.OS - final local checks for Windows PowerShell.
# Run from the repository root:   powershell -ExecutionPolicy Bypass -File audit\final-local-checks.ps1
# Read-only for Git: it never commits, pushes, resets, cleans or stashes. It only builds into app\build.
# Pass -SkipE2E to skip the browser suite (about 10 minutes).
param([switch]$SkipE2E)
$ErrorActionPreference = "Continue"
$root = Get-Location
$results = @()
function Step($name, [scriptblock]$cmd) {
  Write-Host "`n=== $name ===" -ForegroundColor Cyan
  & $cmd
  $ok = ($LASTEXITCODE -eq 0)
  $script:results += [pscustomobject]@{ Check = $name; Result = $(if ($ok) { "PASS" } else { "FAIL (exit $LASTEXITCODE)" }) }
}

Step "git: branch and HEAD" { git rev-parse --abbrev-ref HEAD; git rev-parse HEAD }
Step "git diff --check (whitespace)" { git diff --check }
Set-Location app
Step "typecheck" { npm run typecheck }
Step "unit tests (includes the Windows path fix)" { npm test }
Step "production build" { npm run build }
$routes = (Get-Content build\routes.json | ConvertFrom-Json).Count
Write-Host "prerendered routes: $routes (expected 338)"
$results += [pscustomobject]@{ Check = "prerendered routes = 338"; Result = $(if ($routes -eq 338) { "PASS" } else { "FAIL ($routes)" }) }
if (-not $SkipE2E) {
  # Without this the whole suite fails instantly ("Executable doesn't exist ... chrome-headless-shell"),
  # which is what happened to the first Windows run on 9 Nov 2026: 176 failures, 0 tests executed.
  Step "Playwright browser (install once; no-op when present)" { npx playwright install chromium }
  Step "browser suite (Playwright)" { npx playwright test --workers=2 }
  # the audit script talks to the built site on port 4173; serve it for the duration of the crawl
  $srv = Start-Process node -ArgumentList "scripts/serve.mjs" -PassThru -WindowStyle Hidden
  Start-Sleep -Seconds 2
  Step "accessibility crawl (all routes)" { npm run audit }
  Stop-Process -Id $srv.Id -ErrorAction SilentlyContinue
}
Set-Location $root
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize
Write-Host "To review in a browser:  cd app; `$env:PORT=4174; npm run preview   then open http://localhost:4174/"
