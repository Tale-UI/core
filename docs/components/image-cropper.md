# ImageCropper

`import { ImageCropper } from '@tale-ui/react/image-cropper';`

Image crop UI built on `react-image-crop`. Requires the `react-image-crop` peer dependency.

## Parts

| Part | Description |
|------|-------------|
| `ImageCropper.Root` | Crop container (wraps `react-image-crop`'s `ReactCrop`). Controls crop state via `crop` + `onChange`. |
| `ImageCropper.Img` | The `<img>` to be cropped. Place directly inside `ImageCropper.Root`. |

## Props

### ImageCropper.Root

Accepts all props from `react-image-crop`'s `ReactCropProps`. Key props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `crop` | `Crop` | — | Controlled crop state |
| `onChange` | `(crop: PixelCrop, percentCrop: PercentCrop) => void` | required | Called on every drag/resize |
| `onComplete` | `(crop: PixelCrop, percentCrop: PercentCrop) => void` | — | Called when the user lifts the pointer |
| `aspect` | `number` | — | Enforced aspect ratio (e.g. `16 / 9`) |
| `circularCrop` | `boolean` | — | Renders a circular crop selection |
| `minWidth` | `number` | — | Minimum crop width in px |
| `minHeight` | `number` | — | Minimum crop height in px |
| `ruleOfThirds` | `boolean` | — | Show rule-of-thirds guide lines |
| `className` | `string` | — | Additional CSS class |

### ImageCropper.Img

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | URL of the image to crop |
| `alt` | `string` | `'Image to be cropped'` | Accessible alt text |

Also accepts all standard `<img>` HTML attributes.

## Utility Functions

These are also exported from the package for use outside the component:

| Export | Description |
|--------|-------------|
| `cropToFile(imageSrc, crop)` | Crops the image to a canvas and returns a `File` |
| `cropToDownloadable(imageSrc, crop)` | Crops the image and triggers a browser download |
| `fileToLink(file)` | Converts a `File` to a Base64 data URL |
| `fileToBlob(file)` | Converts a `File` to a `Blob` |
| `makeAspectCrop` | Re-exported from `react-image-crop` |
| `centerCrop` | Re-exported from `react-image-crop` |

## Basic Usage

```tsx
import { ImageCropper } from '@tale-ui/react/image-cropper';
import { useState } from 'react';
import type { Crop, PixelCrop } from '@tale-ui/react/image-cropper';

function AvatarCropper() {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  return (
    <ImageCropper.Root
      crop={crop}
      onChange={setCrop}
      onComplete={setCompletedCrop}
      aspect={1}
    >
      <ImageCropper.Img src="/photo.jpg" alt="Crop your photo" />
    </ImageCropper.Root>
  );
}
```

## Examples

### With Aspect Ratio

```tsx
<ImageCropper.Root crop={crop} onChange={setCrop} aspect={16 / 9}>
  <ImageCropper.Img src="/landscape.jpg" alt="Crop" />
</ImageCropper.Root>
```

### Circular Crop

```tsx
<ImageCropper.Root crop={crop} onChange={setCrop} aspect={1} circularCrop>
  <ImageCropper.Img src="/photo.jpg" alt="Crop avatar" />
</ImageCropper.Root>
```

### Save Cropped Image

```tsx
import { ImageCropper, cropToFile } from '@tale-ui/react/image-cropper';

async function handleSave() {
  if (completedCrop && imageSrc) {
    const file = await cropToFile(imageSrc, completedCrop);
    if (file) {
      // upload or preview the file
    }
  }
}
```

### With makeAspectCrop Helper

```tsx
import { ImageCropper, makeAspectCrop, centerCrop } from '@tale-ui/react/image-cropper';

function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
  const initialCrop = centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 16 / 9, width, height),
    width,
    height,
  );
  setCrop(initialCrop);
}
```

## CSS Classes

- `.tale-image-cropper` — Root wrapper (applies to `ReactCrop` element)
- `.tale-image-cropper__img` — The `<img>` element

The full `ReactCrop` CSS is included in `@tale-ui/react-styles`. Consumers do **not** need to import `react-image-crop/dist/ReactCrop.css`.

## Notes

- Requires `react-image-crop` to be installed: `npm install react-image-crop`
- Do **not** import `react-image-crop/dist/ReactCrop.css` — Tale UI's styles already include the necessary CSS themed with `--color-60` tokens.
