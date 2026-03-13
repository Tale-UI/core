type ClassNameFn = (state: any) => string | undefined;
type ClassName = string | ClassNameFn | undefined;

export function cx(base: string, extra?: ClassName): ClassName {
  if (typeof extra === 'function') {
    return (state: any) => {
      const result = extra(state);
      return result ? `${base} ${result}` : base;
    };
  }
  return extra ? `${base} ${extra}` : base;
}
