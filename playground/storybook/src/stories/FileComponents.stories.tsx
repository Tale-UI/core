import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { Button } from '@tale-ui/react/button';

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
    const [dropped, setDropped] = React.useState(false);

    return (
      <DropZone
        onDrop={() => setDropped(true)}
        className="story-dropzone-basic"
      >
        <p>{dropped ? 'File dropped!' : 'Drop files here'}</p>
      </DropZone>
    );
  },
};

export const FileTriggerStory: Story = {
  name: 'File Trigger',
  render() {
    const [fileName, setFileName] = React.useState<string | null>(null);

    return (
      <div className="story-file-trigger">
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
  name: 'Combined (click or drag)',
  render() {
    const [files, setFiles] = React.useState<string[]>([]);

    const addFiles = (names: string[]) =>
      setFiles((prev) => [...prev, ...names]);

    return (
      <DropZone
        onDrop={(entry) => {
          const names = entry.items
            .filter((item) => item.kind === 'file')
            .map((item) => ('name' in item ? item.name : 'unknown'));
          addFiles(names);
        }}
        className="story-dropzone-combined"
      >
        <FileTrigger
          onSelect={(fileList) => {
            if (fileList) {addFiles(Array.from(fileList).map((f) => f.name));}
          }}
        >
          <Button variant="neutral">Click or drag files here</Button>
        </FileTrigger>
        {files.length > 0 && (
          <p className="story-dropzone-files">Files: {files.join(', ')}</p>
        )}
      </DropZone>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">Drag only</p>
          <DropZone className="story-dropzone-basic">
            <p>Drop files here</p>
          </DropZone>
        </div>
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">Click or drag</p>
          <DropZone className="story-dropzone-combined">
            <FileTrigger onSelect={() => {}}>
              <Button variant="neutral">Click or drag files here</Button>
            </FileTrigger>
          </DropZone>
        </div>
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">FileTrigger standalone</p>
          <FileTrigger onSelect={() => {}}>
            <Button>Upload file</Button>
          </FileTrigger>
        </div>
      </div>
    );
  },
};
