# Build a valid .docx from an extracted folder using .NET CreateFromDirectory
# (forward-slash entry names, which Word requires; Compress-Archive emits
# backslashes and produces a blank document).
param(
  [string]$SrcDir,
  [string]$OutZip
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path -LiteralPath $OutZip) {
  Remove-Item -LiteralPath $OutZip -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($SrcDir, $OutZip)
Write-Output ("created " + (Get-Item -LiteralPath $OutZip).Length + " bytes at " + $OutZip)

$z = [System.IO.Compression.ZipFile]::OpenRead($OutZip)
$names = @($z.Entries | ForEach-Object { $_.FullName })
$z.Dispose()

$back = @($names | Where-Object { $_ -match '\\' })
Write-Output ("total entries: " + $names.Count)
Write-Output ("backslash entries: " + $back.Count)
if ($back.Count -gt 0) { Write-Output "BAD entries: " + ($back -join ", ") }
Write-Output ("has [Content_Types].xml : " + ($names -contains '[Content_Types].xml'))
Write-Output ("has word/document.xml   : " + ($names -contains 'word/document.xml'))
Write-Output ("first entries: " + (($names | Select-Object -First 6) -join " | "))
