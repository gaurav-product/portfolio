#!/usr/bin/env node
/** Minimal static server for the built site — clean URLs, 404 page, range requests for the film. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../build/client");
const BASE = (process.env.BASE_PATH || "/").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4173);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".pdf": "application/pdf", ".json": "application/json", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml" };
const cache = new Map();
export function start(port = PORT) {
  const server = http.createServer((req, res) => {
    let url = decodeURIComponent((req.url || "/").split("?")[0]);
    if (BASE && url.startsWith(BASE)) url = url.slice(BASE.length) || "/";
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    else if (!fs.existsSync(file) && fs.existsSync(file + "/index.html")) file = file + "/index.html";
    let status = 200;
    if (!fs.existsSync(file)) { file = path.join(ROOT, "404.html"); status = 404; }
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    const size = fs.statSync(file).size;
    const range = req.headers.range;
    if (range && status === 200) {
      const [s, e] = range.replace("bytes=", "").split("-");
      const start = Number(s), end = e ? Number(e) : size - 1;
      res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res); return;
    }
    // Compress text like any production static host (GitHub Pages, Cloudflare, Netlify) does.
    if (/text|javascript|json|svg|xml/.test(type) && /gzip/.test(String(req.headers["accept-encoding"]))) {
      // keyed on mtime so a rebuild under a running server is never served stale
      const key = `${file}:${fs.statSync(file).mtimeMs}`;
      const body = cache.get(key) ?? zlib.gzipSync(fs.readFileSync(file), { level: 9 });
      cache.set(key, body);
      res.writeHead(status, { "Content-Type": type, "Content-Encoding": "gzip", "Content-Length": body.length, Vary: "Accept-Encoding" });
      res.end(body); return;
    }
    res.writeHead(status, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}
if (import.meta.url === `file://${process.argv[1]}`) start().then(() => console.log(`serving build/client on http://127.0.0.1:${PORT}${BASE}/`));
