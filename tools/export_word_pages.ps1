param(
  [Parameter(Mandatory = $true)][string]$DocxPath,
  [Parameter(Mandatory = $true)][string]$OutputDir
)

New-Item -ItemType Directory -Force $OutputDir | Out-Null
Add-Type -AssemblyName System.Drawing

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
  $doc = $word.Documents.Open($DocxPath, $false, $true)
  $pages = $doc.ComputeStatistics(2)
  Write-Output "pages=$pages"

  for ($i = 1; $i -le $pages; $i++) {
    $startRange = $doc.GoTo(1, 1, $i)
    if ($i -lt $pages) {
      $nextRange = $doc.GoTo(1, 1, $i + 1)
      $end = $nextRange.Start - 1
    } else {
      $end = $doc.Content.End
    }

    $range = $doc.Range($startRange.Start, $end)
    [byte[]]$bits = $range.EnhMetaFileBits
    $ms = New-Object IO.MemoryStream(,$bits)
    $mf = New-Object Drawing.Imaging.Metafile($ms)
    $bmp = New-Object Drawing.Bitmap(1000, 1294)
    $g = [Drawing.Graphics]::FromImage($bmp)
    $g.Clear([Drawing.Color]::White)
    $g.DrawImage($mf, 0, 0, 1000, 1294)
    $png = Join-Path $OutputDir ("word-page{0}.png" -f $i)
    $bmp.Save($png, [Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $mf.Dispose()
    $ms.Dispose()
    Write-Output $png
  }

  $doc.Close($false)
} finally {
  $word.Quit()
}
