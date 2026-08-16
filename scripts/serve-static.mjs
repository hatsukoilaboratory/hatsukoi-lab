import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const staticRoot = normalize(process.argv[2] ?? "dist/public");
const port = Number(process.argv[3] ?? 4173);
const mimeTypes = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon" };

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  const candidate = normalize(join(staticRoot, pathname.replace(/^\/+/, "")));
  const safeCandidate = candidate.startsWith(staticRoot) ? candidate : join(staticRoot, "index.html");
  const hasExtension = extname(pathname) !== "";
  const directoryIndex = existsSync(safeCandidate) && statSync(safeCandidate).isDirectory() ? join(safeCandidate, "index.html") : null;
  if ((!existsSync(safeCandidate) || (!statSync(safeCandidate).isFile() && !directoryIndex)) && hasExtension) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
    return;
  }
  const filePath = existsSync(safeCandidate) && statSync(safeCandidate).isFile() ? safeCandidate : directoryIndex && existsSync(directoryIndex) ? directoryIndex : join(staticRoot, "index.html");
  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream", "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable" });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Static server listening at http://127.0.0.1:${port}`));
