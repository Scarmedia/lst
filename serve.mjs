import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { env } from "node:process";

const port = parseInt(env.PORT || "8080", 10);
const clientDir = new URL("./dist/client/", import.meta.url).pathname;

const mimeTypes = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain",
};

const serverEntry = await import("./dist/server/server.js");
const handler = serverEntry.default || serverEntry;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    // Serve static assets from dist/client/
    if (req.method === "GET" || req.method === "HEAD") {
      const filePath = path.join(clientDir, url.pathname);
      if (filePath.startsWith(clientDir)) {
        try {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            res.writeHead(200, {
              "Content-Type": mimeTypes[ext] || "application/octet-stream",
              "Content-Length": stat.size,
              "Cache-Control": "public, max-age=31536000, immutable",
            });
            if (req.method === "GET") {
              fs.createReadStream(filePath).pipe(res);
            } else {
              res.end();
            }
            return;
          }
        } catch {}
      }
    }

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
    }

    let body;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const response = await handler.fetch(request, env, {});

    res.writeHead(response.status, response.statusText, Object.fromEntries(response.headers));
    if (response.body) {
      for await (const chunk of response.body) {
        res.write(chunk);
      }
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
