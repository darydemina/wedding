import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(__dirname, "dist");
const port = Number(process.env.PORT || 4173);
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || "";
const telegramChatIds = (process.env.TELEGRAM_CHAT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 32_768) {
      throw new Error("request-too-large");
    }
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function sendTelegramMessage({ name, guestCount, attendance }) {
  if (!telegramBotToken || telegramChatIds.length === 0) {
    throw new Error("telegram-not-configured");
  }

  const attendanceLabel = attendance === "yes" ? "Придут" : "Не смогут";
  const text = [
    "Новая анкета",
    `Имя и фамилия: ${name}`,
    `Количество гостей: ${guestCount}`,
    `Статус: ${attendanceLabel}`,
  ].join("\n");

  const endpoint = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const results = await Promise.all(
    telegramChatIds.map((chatId) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      })
    )
  );

  if (results.some((result) => !result.ok)) {
    throw new Error("telegram-send-failed");
  }
}

async function handleRsvp(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "method-not-allowed" });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const name = String(body.name || "").trim();
    const guestCount = String(body.guestCount || "").trim();
    const attendance = body.attendance === "no" ? "no" : "yes";

    if (!name || !guestCount) {
      sendJson(response, 400, { ok: false, error: "missing-fields" });
      return;
    }

    await sendTelegramMessage({ name, guestCount, attendance });
    sendJson(response, 200, { ok: true });
  } catch (error) {
    const status = error.message === "telegram-not-configured" ? 503 : 500;
    sendJson(response, status, { ok: false, error: error.message || "server-error" });
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = join(distDir, normalizedPath);
  const filePath = existsSync(requestedPath) && !requestedPath.endsWith("/")
    ? requestedPath
    : join(distDir, "index.html");

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = createServer((request, response) => {
  if (request.url?.startsWith("/api/rsvp")) {
    handleRsvp(request, response);
    return;
  }

  serveStatic(request, response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Wedding invite server listening on ${port}`);
});
