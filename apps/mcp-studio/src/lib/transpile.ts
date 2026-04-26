// TSX → JS transpilation via Sucrase (client-side, no wasm required).

let _sucrase: typeof import('sucrase') | null = null;

async function getSucrase() {
  if (!_sucrase) _sucrase = await import('sucrase');
  return _sucrase;
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
