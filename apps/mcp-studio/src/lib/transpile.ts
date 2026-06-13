// TSX → JS transpilation via Sucrase (client-side, no wasm required).

let sucraseModule: typeof import('sucrase') | null = null;

async function getSucrase() {
  if (!sucraseModule) {sucraseModule = await import('sucrase');}
  return sucraseModule;
}

export interface TranspileResult {
  code: string;
  error?: never;
}

export interface TranspileError {
  code?: never;
  error: string;
}

export async function transpileTsx(tsx: string): Promise<TranspileResult | TranspileError> {
  try {
    const sucrase = await getSucrase();
    const result = sucrase.transform(tsx, {
      transforms: ['typescript', 'jsx', 'imports'],
      jsxRuntime: 'classic',
      production: false,
    });
    return { code: result.code };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
