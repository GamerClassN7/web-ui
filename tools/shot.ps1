# Headless screenshots of index.html in all 4 theme combinations.
# Usage: powershell -File tools\shot.ps1 -Out <dir> [-Width 1440] [-Height 5200] [-Hash "#panels"]
# Needs the local server:  python -m http.server 8765 --bind 127.0.0.1 --directory <project>
param(
  [Parameter(Mandatory)] [string]$Out,
  [int]$Width = 1440,
  [int]$Height = 5200,
  [string]$Hash = ""
)
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
New-Item -ItemType Directory -Force $Out | Out-Null
$chromeProfile = Join-Path $env:TEMP "me-shot-profile"   # keep the Chrome profile out of the project
foreach ($s in "me1", "me2", "me3") {
  foreach ($m in "dark", "light") {
    $file = Join-Path $Out "$s-$m.png"
    & $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
      "--user-data-dir=$chromeProfile" "--window-size=$Width,$Height" --virtual-time-budget=9000 `
      "--screenshot=$file" "http://127.0.0.1:8765/index.html?style=$s&mode=$m$Hash" 2>$null | Out-Null
    "{0}: {1}" -f $file, (Test-Path $file)
  }
}
