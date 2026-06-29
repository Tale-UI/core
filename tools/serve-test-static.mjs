#!/usr/bin/env node
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const [, , rootArg, defaultPortArg = '6173', envNameArg] = process.argv;

if (!rootArg) {
  console.error('Usage: node tools/serve-test-static.mjs <fixture-root> <default-port> [env-name]');
  process.exit(1);
}

const fixtureRoot = resolve(ROOT, rootArg);
const publicRoot = resolve(fixtureRoot, 'build');
const port = Number(process.env[envNameArg] ?? defaultPortArg);
const host = '127.0.0.1';

if (!Number.isInteger(port) || port <= 0) {
  console.error(`Invalid port: ${process.env[envNameArg] ?? defaultPortArg}`);
  process.exit(1);
}

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function getFilePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const normalized = pathname === '/' ? '/index.html' : pathname;
  const requestedPath = resolve(publicRoot, `.${normalized}`);

  if (relative(publicRoot, requestedPath).startsWith('..')) {
    return null;
  }

  if (existsSync(requestedPath) && statSync(requestedPath).isFile()) {
    return requestedPath;
  }

  return join(publicRoot, 'index.html');
}

const server = createServer((request, response) => {
  const filePath = getFilePath(request.url ?? '/');

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.setHeader('Content-Type', contentTypes.get(extname(filePath)) ?? 'application/octet-stream');
  createReadStream(filePath).pipe(response);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set ${envNameArg ?? 'TALE_UI_TEST_PORT'} to another port.`);
    process.exit(1);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`Serving ${publicRoot} at http://${host}:${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
