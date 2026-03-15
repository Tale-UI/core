import type { Meta, StoryObj } from '@storybook/react';
import { TagGroup } from '@tale-ui/react/tag-group';
import type { Selection } from 'react-aria-components';
import { useState } from 'react';

type Args = {
  selectionMode?: 'none' | 'single' | 'multiple';
};

const meta: Meta<Args> = {
  title: 'Components/TagGroup',
  parameters: { layout: 'centered' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
  args: {
    selectionMode: 'none',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <TagGroup.Root selectionMode={args.selectionMode}>
        <TagGroup.Label>Categories</TagGroup.Label>
        <TagGroup.List>
          <TagGroup.Tag id="react">React</TagGroup.Tag>
          <TagGroup.Tag id="vue">Vue</TagGroup.Tag>
          <TagGroup.Tag id="angular">Angular</TagGroup.Tag>
        </TagGroup.List>
        <TagGroup.Description>Select your frameworks</TagGroup.Description>
      </TagGroup.Root>
    );
  },
};

export const Removable: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    const [tags, setTags] = useState([
      { id: 'react', name: 'React' },
      { id: 'vue', name: 'Vue' },
      { id: 'angular', name: 'Angular' },
      { id: 'svelte', name: 'Svelte' },
    ]);

    const handleRemove = (keys: Selection) => {
      setTags((prev) =>
        prev.filter((tag) => !(keys as Set<string>).has(tag.id)),
      );
    };

    return (
      <TagGroup.Root onRemove={handleRemove}>
        <TagGroup.Label>Frameworks</TagGroup.Label>
        <TagGroup.List>
          {tags.map((tag) => (
            <TagGroup.Tag key={tag.id} id={tag.id}>
              {tag.name}
            </TagGroup.Tag>
          ))}
        </TagGroup.List>
      </TagGroup.Root>
    );
  },
};

export const WithSelection: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    return (
      <TagGroup.Root selectionMode="multiple">
        <TagGroup.Label>Skills</TagGroup.Label>
        <TagGroup.List>
          <TagGroup.Tag id="typescript">TypeScript</TagGroup.Tag>
          <TagGroup.Tag id="rust">Rust</TagGroup.Tag>
          <TagGroup.Tag id="python">Python</TagGroup.Tag>
          <TagGroup.Tag id="go">Go</TagGroup.Tag>
        </TagGroup.List>
        <TagGroup.Description>Select all that apply</TagGroup.Description>
      </TagGroup.Root>
    );
  },
};
