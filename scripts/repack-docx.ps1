# In-place replace of word/document.xml inside a .docx, preserving the original
# zip structure (forward-slash entry names, all other parts byte-identical to the
# Word-authored file). This avoids rebuilding the whole archive, which on Windows
# .NET / Compress-Archive emits backslash entry names and yields a blank document.
#
# Usage:  .\repack-docx.ps1 <srcDocx> <editedDocumentXml> <workZip>
param(
  [string]$SrcDocx,
  [string]$EditedXml,
  [string]$WorkZip
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

# 1) Start from a copy of the original so its (correct) zip layout is intact.
if (Test-Path -LiteralPath $WorkZip) { Remove-Item -LiteralPath $WorkZip -Force }
Copy-Item -LiteralPath $SrcDocx -Destination $WorkZip -Force
Write-Output ("copied original -> " + $WorkZip)

# 2) Read edited XML; strip any leading BOM, then re-add one (Word convention).
$bytes = [System.IO.File]::ReadAllBytes($EditedXml)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
  $body = New-Object byte[] ($bytes.Length - 3)
  [Array]::Copy($bytes, 3, $body, 0, $body.Length)
  Write-Output "stripped leading BOM from edited xml"
} else {
  $body = $bytes
}
$final = New-Object byte[] ($body.Length + 3)
$final[0] = 0xEF; $final[1] = 0xBB; $final[2] = 0xBF
[Array]::Copy($body, 0, $final, 3, $body.Length)
Write-Output ("edited document.xml payload: " + $final.Length + " bytes (incl. BOM)")

# 3) Open in Update mode (ZipFile.Open(string) defaults to Update; no enum literal needed).
$zip = [System.IO.Compression.ZipFile]::Open($WorkZip)
try {
  $entry = $zip.GetEntry('word/document.xml')
  if ($null -ne $entry) { $entry.Delete(); Write-Output "removed existing word/document.xml entry" }
  $new = $zip.CreateEntry('word/document.xml')
  $s = $new.Open()
  $s.Write($final, 0, $final.Length)
  $s.Close()
  Write-Output "wrote new word/document.xml entry"
} finally {
  $zip.Dispose()
}
Write-Output ("repacked " + $WorkZip + " (" + (Get-Item -LiteralPath $WorkZip).Length + " bytes)")
