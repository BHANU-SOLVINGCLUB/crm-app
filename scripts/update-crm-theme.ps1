Set-Location "C:\Users\namal\OneDrive\Desktop\folder\CRM\crm-app"
$files = Get-ChildItem -Path "src\CRM" -Recurse -File -Include "*.tsx","*.ts"
$changed = New-Object System.Collections.Generic.List[string]

function Update-Content([string]$content) {
  $content = [regex]::Replace($content, '\s+dark:text-slate-\d+', '')
  $content = [regex]::Replace($content, '\s+dark:text-gray-\d+', '')
  $map = @{
    'text-slate-900' = 'text-theme-primary'
    'text-slate-800' = 'text-theme-primary'
    'text-slate-700' = 'text-theme-primary'
    'text-slate-600' = 'text-theme-secondary'
    'text-slate-500' = 'text-theme-secondary'
    'text-slate-400' = 'text-theme-muted'
    'text-slate-300' = 'text-theme-muted'
  }
  foreach ($k in $map.Keys) { $content = $content.Replace($k, $map[$k]) }
  $content = $content.Replace('border-line', 'border-theme')
  $content = $content.Replace('icon-tile bg-white ', 'icon-tile bg-theme-surface ')
  $content = [regex]::Replace($content, 'bg-slate-(50|100|200)(/\d+)?', 'bg-theme-surface')
  return $content
}

foreach ($f in $files) {
  $raw = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
  if ($null -eq $raw) { continue }
  $new = Update-Content $raw
  if ($new -ne $raw) {
    [System.IO.File]::WriteAllText($f.FullName, $new)
    [void]$changed.Add($f.FullName)
  }
}

$manual = @(
  'src\CRM\product-catalog\components\CatalogEmptyState.tsx',
  'src\CRM\product-catalog\components\ProductCatalogLayout.tsx',
  'src\CRM\finance\components\FinanceEmptyState.tsx',
  'src\CRM\support\components\SupportEmptyState.tsx'
)
foreach ($rel in $manual) {
  $path = Join-Path (Get-Location) $rel
  if (-not (Test-Path $path)) { continue }
  $c = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  $orig = $c
  $c = $c -replace 'text-gray-900', 'text-theme-primary'
  $c = $c -replace 'text-gray-600', 'text-theme-secondary'
  $c = $c -replace 'text-gray-500', 'text-theme-secondary'
  $c = $c -replace 'text-theme-primary\s+dark:[^\s"]+', 'text-theme-primary'
  $c = $c -replace 'text-theme-secondary\s+dark:[^\s"]+', 'text-theme-secondary'
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($path, $c)
    if (-not $changed.Contains($path)) { [void]$changed.Add($path) }
  }
}

Write-Output "CHANGED_COUNT=$($changed.Count)"
$remaining = Select-String -Path $files.FullName -Pattern 'text-slate-' -AllMatches -ErrorAction SilentlyContinue
$matchCount = if ($remaining) { ($remaining | ForEach-Object { $_.Matches.Count } | Measure-Object -Sum).Sum } else { 0 }
Write-Output "REMAINING_TEXT_SLATE_MATCHES=$matchCount"
if ($remaining) { $remaining | Group-Object Path | ForEach-Object { Write-Output "FILE: $($_.Name) COUNT: $($_.Count)" } }
