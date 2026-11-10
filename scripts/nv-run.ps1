# Runs a Novamira ability against a site with an inline JSON input, writes raw JSON to out file.
# Usage: .\nv-run.ps1 <ability> <inputJson> <outPath> [site]
$ability  = $args[0]
$inputVar = $args[1]
$outPath  = $args[2]
$site     = if ($args.Length -ge 4) { $args[3] } else { "cms.ayurrakshaonline.com" }

$inPath = Join-Path $env:TEMP "nv-in.json"
[System.IO.File]::WriteAllText($inPath, $inputVar)

$out = & novamira --site $site run $ability --input "@$inPath" --json 2>$null
$raw = $out | Out-String
if ($outPath) { [System.IO.File]::WriteAllText($outPath, $raw) }
Write-Output ("exit=" + $LASTEXITCODE + " out=" + $outPath)
Write-Output ($raw.Substring(0, [Math]::Min(400, $raw.Length)))
