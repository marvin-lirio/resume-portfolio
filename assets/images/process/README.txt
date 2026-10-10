# Process / Approach artwork
Six independent, transparent SVG illustrations with consistent 320 × 200 viewBox.

Files: process-define.svg, process-direct.svg, process-understand.svg, process-validate.svg, process-iterate.svg, process-ship.svg

Suggested repository directory: assets/images/process/

Suggested CSS:
.process-art { width: clamp(110px, 38%, 210px); height: auto; position: absolute; right: 18px; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: .75; }
.process-card { position: relative; overflow: hidden; }
.process-card.is-open .process-art { opacity: .2; }
@media (max-width: 700px) { .process-art { width: 110px; right: 8px; opacity: .4; } }

Place <img class="process-art" src="assets/images/process/process-define.svg" alt="" aria-hidden="true"> inside the appropriate process card. Update selector names to match the current implementation.

SVG colors are authored for the dark theme. For light theme, use CSS filter or adjust strokes in a second variant.
