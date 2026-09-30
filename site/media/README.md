# media/

Binary assets referenced by `content.js`. Nothing is hard-coded into a page —
every file is reached through a record in `content.js → media[]`.

**The binaries live in `docs/media/`, not here.** They are committed once, in the
build output GitHub Pages serves, rather than twice in the repository. This
folder holds their documentation. To replace one, drop the new file in here and
run the build — `build_site.py` copies anything found in `site/media/` over the
deployed copy and never deletes what is already there.

| File | Purpose | Referenced by |
|---|---|---|
| `gaurav-os-intro.mp4` | The introduction film | `content.js → intro.video` |
| `gaurav-os-poster.jpg` | Poster frame; reduced-motion still; Open Graph image | `content.js → intro.poster` |

## The film

`gaurav-os-intro.mp4` is a web encode of `GAURAV_Portfolio_Film_Web.mp4`:

    ffmpeg -i GAURAV_Portfolio_Film_Web.mp4 \
      -c:v libx264 -profile:v high -preset slow -crf 30 -pix_fmt yuv420p \
      -movflags +faststart -c:a aac -b:a 64k -ac 1 media/gaurav-os-intro.mp4

1920x1080 and 65s are preserved exactly — nothing is cropped, stretched or
re-graded. Only the bitrate changes: 24 MB to 11.4 MB, so it sits under the
15 MB per-file publishing limit and starts streaming immediately (`faststart`
puts `moov` ahead of `mdat`).

To replace the film, drop a new MP4 in this folder under the same name and run
`python3 site/scripts/build_site.py --out docs`, or point `content.js →
intro.video` at a new filename. No other file changes.
