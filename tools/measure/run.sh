#!/bin/bash
# Render every mockup screen, register each element against refs/<game>/ea and summarise the offsets.
# usage: tools/measure/run.sh <out_dir> me1,me2,me3      (needs: python -m http.server 8765 in the repo root,
#        node + playwright, python3 with pillow + numpy; ME_OFFLINE=<dir> to serve Bootstrap/fonts locally)
set -e; H=$(cd "$(dirname "$0")" && pwd); d=$1; mkdir -p "$d"; : > "$d/scores.txt"
node "$H/render.js" "$d" "$2" && node "$H/rects.js" "$d" "$2"
for g in ${2//,/ }; do
  for s in graphics calibration sound controls keys gameplay; do python3 -I "$H/sheet.py" "$d" $g $s >> "$d/scores.txt"; done
  python3 -I "$H/reg.py" "$d" $g > "$d/$g-reg.txt"; echo "## $g  (median element shift ref-vs-mock, px)"; python3 -I "$H/summ.py" "$d/$g-reg.txt"
  python3 -I "$H/ink.py" "$d" $g | sed -n '/medians/,$p'
done
cat "$d/scores.txt"
