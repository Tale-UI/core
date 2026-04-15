import * as React from 'react';
import { BoxIllustration } from './assets/box';
import { CloudIllustration } from './assets/cloud';
import { DocumentsIllustration } from './assets/documents';
import { CreditCardIllustration } from './assets/credit-card';

type IllustrationType = 'box' | 'cloud' | 'documents' | 'credit-card';
type Size = 'sm' | 'md' | 'lg';

const types = {
  box: BoxIllustration,
  cloud: CloudIllustration,
  documents: DocumentsIllustration,
  'credit-card': CreditCardIllustration,
} as const;

export interface IllustrationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The illustration to render. */
  type: IllustrationType;
  /** Canvas size. @default 'lg' */
  size?: Size | undefined;
  /** Extra className applied to the inner SVG element. */
  svgClassName?: string | undefined;
  /** Extra className applied to the children overlay container. */
  childrenClassName?: string | undefined;
}

/**
 * Decorative marketing illustrations available in three sizes.
 * Pass `children` to overlay a centred icon or content on top of the illustration.
 *
 * @example
 * ```tsx
 * import { Illustration } from '@tale-ui/react/illustration';
 * import { UploadCloud } from 'lucide-react';
 *
 * <Illustration type="box" size="lg">
 *   <UploadCloud className="w-6 h-6 text-color-60" />
 * </Illustration>
 *
 * <Illustration type="cloud" size="md" />
 * <Illustration type="documents" size="sm" />
 * <Illustration type="credit-card" size="lg" />
 * ```
 */
export function Illustration({ type, size = 'lg', ...rest }: IllustrationProps) {
  const Comp = types[type];
  return <Comp size={size} {...rest} />;
}
Illustration.displayName = 'Illustration';
