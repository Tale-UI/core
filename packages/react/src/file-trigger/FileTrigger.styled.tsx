import {
  FileTrigger as AriaFileTrigger,
  type FileTriggerProps as AriaFileTriggerProps,
} from 'react-aria-components';

// ── FileTrigger ────────────────────────────────────────────────────────────

export type FileTriggerProps = AriaFileTriggerProps;

/**
 * Opens a native file picker when its child (typically a Button) is pressed.
 *
 * @example
 * ```tsx
 * import { FileTrigger } from '@tale-ui/react/file-trigger';
 * import { Button } from '@tale-ui/react/button';
 *
 * <FileTrigger onSelect={(files) => console.log(files)}>
 *   <Button>Upload file</Button>
 * </FileTrigger>
 * ```
 */
export function FileTrigger(props: FileTriggerProps) {
  return <AriaFileTrigger {...props} />;
}
FileTrigger.displayName = 'FileTrigger';
