import * as React from 'react';
import QRCodeStyling, { type Options as QRCodeStylingOptions } from 'qr-code-styling';
import { cx } from '../_cx';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export type { QRCodeStylingOptions };

type QRCodeSize = 'md' | 'lg';

const qrDimensions: Record<QRCodeSize, { width: number; height: number }> = {
  md: { width: 96, height: 96 },
  lg: { width: 128, height: 128 },
};

/* ─── Root ──────────────────────────────────────────────────────────────────── */

export interface RootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The value to encode in the QR code. */
  value: string;
  /** Additional options to pass to qr-code-styling. */
  options?: QRCodeStylingOptions | undefined;
  /**
   * Size of the QR code.
   * @default 'md'
   */
  size?: QRCodeSize | undefined;
}

/**
 * QR code generator with decorative corner handles.
 * Requires `qr-code-styling` to be installed.
 *
 * @example
 * ```tsx
 * import { QRCode } from '@tale-ui/react/qr-code';
 *
 * <QRCode.Root value="https://example.com" size="md" />
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ value, options, size = 'md', className, ...props }, ref) => {
    const canvasRef = React.useRef<HTMLDivElement>(null);
    const instanceRef = React.useRef<QRCodeStyling | null>(null);

    React.useEffect(() => {
      if (!canvasRef.current) { return; }
      // Clear any previous render
      canvasRef.current.innerHTML = '';

      const instance = new QRCodeStyling({
        type: 'svg',
        ...options,
        ...qrDimensions[size],
        data: value,
      });
      instanceRef.current = instance;
      instance.append(canvasRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    React.useEffect(() => {
      if (!instanceRef.current) { return; }
      instanceRef.current.update({ data: value, ...options });
    }, [value, options]);

    return (
      <div
        ref={ref}
        className={cx(`tale-qr-code tale-qr-code--${size}`, className)}
        {...props}
      >
        <div ref={canvasRef} className="tale-qr-code__canvas" />
        <span className="tale-qr-code__handle tale-qr-code__handle--tl" aria-hidden="true" />
        <span className="tale-qr-code__handle tale-qr-code__handle--tr" aria-hidden="true" />
        <span className="tale-qr-code__handle tale-qr-code__handle--br" aria-hidden="true" />
        <span className="tale-qr-code__handle tale-qr-code__handle--bl" aria-hidden="true" />
      </div>
    );
  },
);
Root.displayName = 'QRCode.Root';

/* ─── Scan ──────────────────────────────────────────────────────────────────── */

export interface ScanProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Decorative gradient scan effect overlay for a QR code.
 * Position absolutely inside a relative-positioned container that also contains `QRCode.Root`.
 */
export const Scan = React.forwardRef<HTMLDivElement, ScanProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('tale-qr-code-scan', className)}
      style={{
        maskImage:
          'radial-gradient(52.19% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 95.31%)',
        WebkitMaskImage:
          'radial-gradient(52.19% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 95.31%)',
        ...style,
      }}
      {...props}
    />
  ),
);
Scan.displayName = 'QRCode.Scan';
