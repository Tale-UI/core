import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FileUpload } from '@tale-ui/react/file-upload';

const meta: Meta = {
  title: 'Components/FileUpload',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<Record<number, number>>({});

    const addFiles = (fl: FileList) => {
      const arr = Array.from(fl);
      setFiles((p) => {
        const newFiles = [...p, ...arr];
        // Simulate upload progress
        arr.forEach((_, i) => {
          const idx = p.length + i;
          let pct = 0;
          const interval = setInterval(() => {
            pct += 10;
            setProgress((prev) => ({ ...prev, [idx]: pct }));
            if (pct >= 100) clearInterval(interval);
          }, 200);
        });
        return newFiles;
      });
    };

    return (
      <div style={{ width: '100%', maxWidth: 480 }}>
        <FileUpload.Root>
          <FileUpload.DropZone
            hint="PNG, JPG, PDF (max 5 MB)"
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024}
            onDropFiles={addFiles}
          />
          {files.length > 0 && (
            <FileUpload.List>
              {files.map((f, i) => (
                <FileUpload.ListItemProgressBar
                  key={`${f.name}-${i}`}
                  name={f.name}
                  size={f.size}
                  progress={progress[i] ?? 0}
                  onDelete={() => {
                    setFiles((p) => p.filter((_, j) => j !== i));
                    setProgress((p) => {
                      const next = { ...p };
                      delete next[i];
                      return next;
                    });
                  }}
                />
              ))}
            </FileUpload.List>
          )}
        </FileUpload.Root>
      </div>
    );
  },
};

export const ProgressFillVariant: Story = {
  name: 'Fill Progress Variant',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <FileUpload.Root>
        <FileUpload.DropZone hint="Any file type accepted" />
        <FileUpload.List>
          <FileUpload.ListItemProgressFill
            name="design-system.fig"
            size={2_400_000}
            progress={65}
            onDelete={() => {}}
          />
          <FileUpload.ListItemProgressFill
            name="brand-assets.zip"
            size={8_100_000}
            progress={100}
            onDelete={() => {}}
          />
        </FileUpload.List>
      </FileUpload.Root>
    </div>
  ),
};

export const ErrorStates: Story = {
  name: 'Error States',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <FileUpload.List>
        <FileUpload.ListItemProgressBar
          name="huge-video.mp4"
          size={500_000_000}
          progress={0}
          failed
          onDelete={() => {}}
          onRetry={() => alert('Retry!')}
        />
        <FileUpload.ListItemProgressFill
          name="corrupt.psd"
          size={1_200_000}
          progress={0}
          failed
          onDelete={() => {}}
          onRetry={() => alert('Retry!')}
        />
      </FileUpload.List>
    </div>
  ),
};

export const DisabledDropZone: Story = {
  name: 'Disabled DropZone',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <FileUpload.Root>
        <FileUpload.DropZone
          hint="Uploads are disabled"
          isDisabled
        />
      </FileUpload.Root>
    </div>
  ),
};
