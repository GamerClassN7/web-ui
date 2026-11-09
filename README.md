# me-web-ui

Bootstrap 6 (6.0.0-alpha.1) restyled as the Mass Effect 1 / 2 / 3 UI, each in dark and light mode.

- `index.html` – landing page for GitHub Pages (links to the showcase and mockups)
- `showcase.html` – component showcase with a style (ME1/ME2/ME3) and mode (light/dark) switcher
- `css/` – theme layers (`me-theme.css`, `me-widgets.css`, `me-me1.css`, `me-me2.css`, `me-shapes.css`)
- `assets/` – SVG icons and 9-slice skins
- `mockups/` – the game Options screens rebuilt in HTML, side by side with the reference PNGs
- `tools/` – measuring scripts (`compare.py`, `elements.py`, `zoom.py`, ...)
- `refs/` – reference screenshots (game UI, property of their owners; kept private for measuring only)

Run a local server (`python -m http.server 8765`) and open `index.html`, `showcase.html` or `mockups/me3.html`.

## GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`. The site is plain static files; `.nojekyll` skips the Jekyll build.
