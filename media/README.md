# Reels / media

The site plays one file at a time in the main stage. Drop four files here using the
names below, then reload — no build step.

| Slot | File | Domain |
|---|---|---|
| 01 | `01-voice.mp4` | Voice engineering |
| 02 | `02-companion.mp4` | Companion structures |
| 03 | `03-initiative.mp4` | Active intelligence |
| 04 | `04-assisted.mp4` | Assisted intelligence |

## Switching a slot to a new file

Open `app.js` and edit the `PROJECTS` array near the top. Each entry has:

```js
media: {
  type: "video",                 // "video" or "image"
  src: "media/01-voice.mp4",     // relative path, no leading slash
  poster: "",                    // optional still, e.g. "media/01-voice.jpg"
  fit: "contain"                 // "contain" = whole frame, "cover" = fill stage
}
```

- Use `"image"` for a still (PNG/JPG/WebP) instead of a video.
- `"cover"` is punchier but crops; `"contain"` letterboxes. Vertical reels work
  with `"contain"` in the 16:9 stage.
- External URLs (S3, Bunny, Cloudflare R2, etc.) work too — put the full `https://`
  URL in `src`. Make sure the host allows your domain (CORS is not required for a
  plain `<video>` source, but hotlink protection may block it).
- Titles, descriptions, stack tags and the "case note" link all live in the same
  array. Set `link.href` to a real URL when you have one; otherwise the site shows
  "Case notes on request".

## Encoding

Aim for fast first paint:

```bash
ffmpeg -i input.mov -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 21 \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart media/01-voice.mp4
```

- H.264 / AAC MP4, `+faststart`, 1080p, 24–30 fps.
- Keep each clip under roughly 20–30 MB; `preload="metadata"` means the page fetches
  the header only, and playback starts when the user hits play.
- `poster` images should be 16:9 and roughly the same size as the video frame.

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Avoid opening `index.html` via `file://` — some
browsers refuse local video playback that way.

## Adding contact commands

In `app.js`, fill in `CONFIG.email` and/or `CONFIG.github`. New CLI lines
(`mail --connect`, `connect --github`) appear automatically; blank values render
nothing, so there are no dead commands.
