import type { Plugin, ViteDevServer } from 'vite';
import { readFileSync } from 'node:fs';
import net from 'node:net';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(currentDir, '..', '..');
const MANIFEST_PATH = join(ROOT, 'tools', 'manifests', 'tooling-dashboard.json');
const TOOLS = join(ROOT, 'tools');

type NodeRequest = any;
type NodeResponse = any;

let providersModule: any = null;

async function getProviders() {
  if (!providersModule) {
    providersModule = await import(join(TOOLS, 'providers.mjs') as unknown as string);
  }
  return providersModule;
}

function json(res: NodeResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(body);
}

function readManifest() {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

function checkHost(port: number, host: string): Promise<boolean> {
  return new Promise((resolvePort) => {
    const socket = new net.Socket();
    const finish = (running: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolvePort(running);
    };
    socket.setTimeout(350);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

async function checkPort(port: number): Promise<boolean> {
  const probes = await Promise.all([
    checkHost(port, '127.0.0.1'),
    checkHost(port, '::1'),
    checkHost(port, 'localhost'),
  ]);
  return probes.some(Boolean);
}

export function toolingApiPlugin(): Plugin {
  return {
    name: 'tooling-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: NodeRequest, res: NodeResponse, next: () => void) => {
        try {
          const url = new URL(req.url, 'http://localhost');

          if (req.method === 'GET' && url.pathname === '/api/tooling/manifest') {
            return json(res, 200, readManifest());
          }

          if (req.method === 'GET' && url.pathname === '/api/tooling/status') {
            const manifest = readManifest();
            const applications = await Promise.all(
              manifest.applications.map(async (app: any) => ({
                id: app.id,
                running: typeof app.port === 'number' ? await checkPort(app.port) : false,
                port: app.port,
                url: app.url,
              })),
            );

            const providers = await getProviders();
            const providerStatus = await providers.listAvailableModels();
            return json(res, 200, {
              applications,
              providers: providerStatus.providers,
              models: providerStatus.models,
              errors: providerStatus.errors,
            });
          }

          return next();
        } catch (err) {
          if (!res.headersSent) {
            return json(res, 500, { error: err instanceof Error ? err.message : String(err) });
          }
          return undefined;
        }
      });
    },
  };
}
