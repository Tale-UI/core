import * as React from 'react';
import { cx } from '../../_cx';

type Size = 'sm' | 'md' | 'lg';

export function Circle({ size = 'lg', className, ...props }: React.SVGProps<SVGSVGElement> & { size?: Size }) {
  if (size === 'lg') {
    return (
      <svg width="768" height="768" viewBox="0 0 768 768" fill="none" className={cx('tale-background-pattern', className)} {...props}>
        <mask id="bp-circle-lg-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="768" height="768">
          <rect width="768" height="768" fill="url(#bp-circle-lg-grad)" />
        </mask>
        <g mask="url(#bp-circle-lg-mask)">
          <circle cx="384" cy="384" r="47.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="95.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="143.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="191.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="239.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="287.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="335.5" stroke="currentColor" />
          <circle cx="384" cy="384" r="383.5" stroke="currentColor" />
        </g>
        <defs>
          <radialGradient id="bp-circle-lg-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(384 384) rotate(90) scale(384 384)">
            <stop /><stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  if (size === 'md') {
    return (
      <svg width="480" height="480" viewBox="0 0 480 480" fill="none" className={cx('tale-background-pattern', className)} {...props}>
        <mask id="bp-circle-md-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="480">
          <rect width="480" height="480" fill="url(#bp-circle-md-grad)" />
        </mask>
        <g mask="url(#bp-circle-md-mask)">
          <circle cx="240" cy="240" r="47.5" stroke="currentColor" />
          <circle cx="240" cy="240" r="79.5" stroke="currentColor" />
          <circle cx="240" cy="240" r="111.5" stroke="currentColor" />
          <circle cx="240" cy="240" r="143.5" stroke="currentColor" />
          <circle cx="240" cy="240" r="175.5" stroke="currentColor" />
          <circle cx="240" cy="240" r="207.5" stroke="currentColor" />
          <circle cx="240" cy="240" r="239.5" stroke="currentColor" />
        </g>
        <defs>
          <radialGradient id="bp-circle-md-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(240 240) rotate(90) scale(240 240)">
            <stop /><stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  // sm
  return (
    <svg width="336" height="336" viewBox="0 0 336 336" fill="none" className={cx('tale-background-pattern', className)} {...props}>
      <mask id="bp-circle-sm-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="336" height="336">
        <rect width="336" height="336" fill="url(#bp-circle-sm-grad)" />
      </mask>
      <g mask="url(#bp-circle-sm-mask)">
        <circle cx="168" cy="168" r="47.5" stroke="currentColor" />
        <circle cx="168" cy="168" r="71.5" stroke="currentColor" />
        <circle cx="168" cy="168" r="95.5" stroke="currentColor" />
        <circle cx="168" cy="168" r="119.5" stroke="currentColor" />
        <circle cx="168" cy="168" r="143.5" stroke="currentColor" />
        <circle cx="168" cy="168" r="167.5" stroke="currentColor" />
      </g>
      <defs>
        <radialGradient id="bp-circle-sm-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
          gradientTransform="translate(168 168) rotate(90) scale(168 168)">
          <stop /><stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
