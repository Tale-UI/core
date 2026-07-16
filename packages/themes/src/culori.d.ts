// culori v4 ships no TypeScript declarations — keep this package independently type-checkable.
declare module 'culori' {
  export function converter(mode: string): (color: string | object) => any;
  export function formatHex(color: object): string;
  export function clampChroma(color: object, mode: string): object;
}
