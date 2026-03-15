import {
  FileTrigger as AriaFileTrigger,
  type FileTriggerProps as AriaFileTriggerProps,
} from 'react-aria-components';

// ── FileTrigger ────────────────────────────────────────────────────────────

export type FileTriggerProps = AriaFileTriggerProps;

export function FileTrigger(props: FileTriggerProps) {
  return <AriaFileTrigger {...props} />;
}
FileTrigger.displayName = 'FileTrigger';
