import * as React from 'react';
import ReactCrop from 'react-image-crop';
import type { ReactCropProps, PixelCrop } from 'react-image-crop';
import { cx } from '../_cx';

export type { ReactCropProps, PixelCrop, PercentCrop, Crop } from 'react-image-crop';
export { makeAspectCrop, centerCrop } from 'react-image-crop';

/* ─── Root ──────────────────────────────────────────────────────────────────── */

export interface RootProps extends ReactCropProps {
  /** Additional CSS class name. */
  className?: string | undefined;
}

/**
 * Image crop component built on react-image-crop.
 * Requires `react-image-crop` to be installed.
 *
 * Place `ImageCropper.Img` inside as the child.
 *
 * @example
 * ```tsx
 * import { ImageCropper } from '@tale-ui/react/image-cropper';
 * import { useState } from 'react';
 * import type { Crop } from '@tale-ui/react/image-cropper';
 *
 * function Example() {
 *   const [crop, setCrop] = useState<Crop>();
 *   return (
 *     <ImageCropper.Root crop={crop} onChange={setCrop} aspect={16 / 9}>
 *       <ImageCropper.Img src="/photo.jpg" alt="Crop me" />
 *     </ImageCropper.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, _ref) => (
    <ReactCrop {...props} className={cx('tale-image-cropper', className)} />
  ),
);
Root.displayName = 'ImageCropper.Root';

/* ─── Img ───────────────────────────────────────────────────────────────────── */

export interface ImgProps extends React.ComponentPropsWithRef<'img'> {}

/**
 * The image element inside an `ImageCropper.Root`.
 */
export const Img = React.forwardRef<HTMLImageElement, ImgProps>(
  ({ className, alt, ...props }, ref) => (
    <img
      ref={ref}
      alt={alt || 'Image to be cropped'}
      className={cx('tale-image-cropper__img', className)}
      {...props}
    />
  ),
);
Img.displayName = 'ImageCropper.Img';

/* ─── Utilities ─────────────────────────────────────────────────────────────── */

/**
 * Crops an image from the given source URL and converts it into a `File`.
 */
export const cropToFile = async (
  imageSrc: string,
  crop: PixelCrop,
): Promise<File | null> => {
  if (!crop || !imageSrc) { return null; }

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { return null; }

  const { width, height, x, y } = crop;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  return new Promise<File | null>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { resolve(null); return; }
        resolve(new File([blob], 'cropped-image.jpeg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      1,
    );
  });
};

/**
 * Crops an image and triggers a browser download of the result.
 */
export const cropToDownloadable = async (
  imageSrc: string,
  crop: PixelCrop,
): Promise<void> => {
  const file = await cropToFile(imageSrc, crop);
  if (!file) { return; }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cropped-image.jpeg';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

/**
 * Converts a `File` into a Base64-encoded data URL.
 */
export const fileToLink = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

/**
 * Converts a `File` into a `Blob`.
 */
export const fileToBlob = (file: File): Promise<Blob> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(new Blob([reader.result as ArrayBuffer]));
    reader.readAsArrayBuffer(file);
  });
