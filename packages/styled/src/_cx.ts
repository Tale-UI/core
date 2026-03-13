export function cx(base: string, extra?: string): string {
  return extra ? `${base} ${extra}` : base;
}
