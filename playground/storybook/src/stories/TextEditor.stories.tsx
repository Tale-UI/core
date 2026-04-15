import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextEditor } from '@tale-ui/react/text-editor';

const meta: Meta = {
  title: 'Components/TextEditor',
  parameters: { layout: 'padded' },
};

export default meta;

export const Default: StoryObj = {
  render() {
    return (
      <TextEditor.Root placeholder="Start writing…">
        <TextEditor.Label>Body</TextEditor.Label>
        <TextEditor.Toolbar type="simple" />
        <TextEditor.Content />
        <TextEditor.HintText>Rich-text formatting supported.</TextEditor.HintText>
      </TextEditor.Root>
    );
  },
};

export const Advanced: StoryObj = {
  render() {
    return (
      <TextEditor.Root limit={500}>
        <TextEditor.Label>Description</TextEditor.Label>
        <TextEditor.Toolbar type="advanced" />
        <TextEditor.Content />
        <TextEditor.HintText />
      </TextEditor.Root>
    );
  },
};

export const Disabled: StoryObj = {
  render() {
    return (
      <TextEditor.Root isDisabled>
        <TextEditor.Label>Read-only</TextEditor.Label>
        <TextEditor.Toolbar type="simple" />
        <TextEditor.Content />
      </TextEditor.Root>
    );
  },
};

export const Invalid: StoryObj = {
  render() {
    return (
      <TextEditor.Root isInvalid>
        <TextEditor.Label>Required field</TextEditor.Label>
        <TextEditor.Toolbar type="simple" />
        <TextEditor.Content />
        <TextEditor.HintText>This field is required.</TextEditor.HintText>
      </TextEditor.Root>
    );
  },
};

export const WithBubbleMenu: StoryObj = {
  render() {
    return (
      <TextEditor.Root placeholder="Select text to see the bubble menu…">
        <TextEditor.Label>Notes</TextEditor.Label>
        <TextEditor.Content />
        <TextEditor.BubbleMenu>
          <TextEditor.Bold />
          <TextEditor.Italic />
          <TextEditor.Underline />
          <TextEditor.Link />
        </TextEditor.BubbleMenu>
      </TextEditor.Root>
    );
  },
};

export const FloatingToolbar: StoryObj = {
  render() {
    return (
      <TextEditor.Root>
        <TextEditor.Label>Floating toolbar</TextEditor.Label>
        <TextEditor.Toolbar type="simple" floating />
        <TextEditor.Content />
      </TextEditor.Root>
    );
  },
};
