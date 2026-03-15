import type { Meta, StoryObj } from '@storybook/react';
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { Button } from '@tale-ui/react/button';
import { useState } from 'react';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/File Components',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const DropZoneStory: Story = {
  name: 'Drop Zone',
  render() {
    const [dropped, setDropped] = useState(false);

    return (
      <DropZone
        onDrop={() => setDropped(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 150,
          border: '2px dashed var(--neutral-30)',
          borderRadius: 'var(--space-2xs)',
          padding: 'var(--space-m)',
        }}
      >
        <p>{dropped ? 'File dropped!' : 'Drop files here'}</p>
      </DropZone>
    );
  },
};

export const FileTriggerStory: Story = {
  name: 'File Trigger',
  render() {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)', alignItems: 'center' }}>
        <FileTrigger
          onSelect={(fileList) => {
            if (fileList) {
              setFileName(Array.from(fileList).map((f) => f.name).join(', '));
            }
          }}
        >
          <Button>Upload file</Button>
        </FileTrigger>
        {fileName && <p>Selected: {fileName}</p>}
      </div>
    );
  },
};

export const Combined: Story = {
  name: 'Combined',
  render() {
    const [files, setFiles] = useState<string[]>([]);

    return (
      <DropZone
        onDrop={(e) => {
          const names = e.items
            .filter((item) => item.kind === 'file')
            .map((item) => ('name' in item ? item.name : 'unknown'));
          setFiles((prev) => [...prev, ...names]);
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-s)',
          width: 300,
          height: 200,
          border: '2px dashed var(--neutral-30)',
          borderRadius: 'var(--space-2xs)',
          padding: 'var(--space-m)',
        }}
      >
        <p>Drop files here or</p>
        <FileTrigger
          onSelect={(fileList) => {
            if (fileList) {
              setFiles((prev) => [
                ...prev,
                ...Array.from(fileList).map((f) => f.name),
              ]);
            }
          }}
        >
          <Button>Browse files</Button>
        </FileTrigger>
        {files.length > 0 && (
          <p style={{ fontSize: 'var(--text-s-font-size)' }}>
            Files: {files.join(', ')}
          </p>
        )}
      </DropZone>
    );
  },
};
