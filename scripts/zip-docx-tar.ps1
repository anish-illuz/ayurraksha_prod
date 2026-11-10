# Build a Word-valid .docx from an extracted folder using bsdtar (Windows 10 tar).
# bsdtar writes forward-slash zip entry names (unlike Compress-Archive's backslashes
# and .NET CreateFromDirectory's backslashes here), so Word opens it correctly.
#
# Usage:  .\zip-docx-tar.ps1 -SrcDir <extracted> -OutZip <workzip>
param(
  [string]$SrcDir,
  [string]$OutZip
)

if (Test-Path -LiteralPath $OutZip) { Remove-Item -LiteralPath $OutZip -Force }

# Build the zip from the contents of SrcDir, run from inside it so entries are relative.
Push-Location -LiteralPath $SrcDir
try {
  $items = Get-ChildItem -LiteralPath $SrcDir | ForEach-Object { $_.Name }
  tar -a -c -f $OutZip $items
  if ($LASTEXITCODE -ne 0) { Write-Output "tar exit: $LASTEXITCODE"; Pop-Location; exit 1 }
} finally { Pop-Location }

Write-Output ("zip created: " + (Get-Item -LiteralPath $OutZip).Length + " bytes")

# Validate: entry names must be forward-slash and the two critical parts present.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead($OutZip)
$names = @($z.Entries | ForEach-Object { $_.FullName })
$back = @($names | Where-Object { $_ -match '\\' })
Write-Output ("total entries: " + $names.Count)
Write-Output ("backslash entries: " + $back.Count)
if ($back.Count -gt 0) { Write-Output "BAD: " + ($back -join ", ") }
Write-Output ("has [Content_Types].xml : " + ($names -contains '[Content_Types].xml'))
Write-Output ("has word/document.xml   : " + ($names -contains 'word/document.xml'))

# Read document.xml back and confirm the 64 labels + a spot-check survived.
$de = $z.GetEntry('word/document.xml')
$sr = New-Object System.IO.StreamReader($de.Open())
$doc = $sr.ReadToEnd(); $sr.Close()
$z.Dispose()
Write-Output ("document.xml chars: " + $doc.Length)
Write-Output ("Status: labels: " + ([regex]::Matches($doc, 'Status:')).Count)
Write-Output ("DONE labels: " + ([regex]::Matches($doc, 'DONE')).Count)
Write-Output ("partial (PARTIALLY) labels: " + ([regex]::Matches($doc, 'PARTIALLY')).Count)
Write-Output ("Gargling measure-spit-rinse present: " + ($doc -match 'Measure the Oil'))
