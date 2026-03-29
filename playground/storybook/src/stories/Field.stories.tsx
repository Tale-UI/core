import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '@tale-ui/react/field';
import { Input } from '@tale-ui/react/input';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Field',
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <div className="story-narrow">
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input className="tale-input" placeholder="Enter your name" />
        </Field.Control>
      </Field.Root>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="story-narrow">
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input className="tale-input" type="email" placeholder="you@example.com" />
        </Field.Control>
        <Field.Description>We will never share your email with anyone.</Field.Description>
      </Field.Root>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="story-narrow">
      <Input.Root isInvalid>
        <Input.Label>Password</Input.Label>
        <Input.Input type="password" />
        <Input.Description>Must be at least 8 characters long.</Input.Description>
        <Input.ErrorMessage>This field is required.</Input.ErrorMessage>
      </Input.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ flex: '1 1 240px' }}>
          <p className="story-label">Label + description</p>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Field.Control>
              <input className="tale-input" type="email" placeholder="you@example.com" />
            </Field.Control>
            <Field.Description>We will never share your email.</Field.Description>
          </Field.Root>
        </div>
        <div style={{ flex: '1 1 240px' }}>
          <p className="story-label">Label + error</p>
          <Input.Root isInvalid>
            <Input.Label>Username</Input.Label>
            <Input.Input placeholder="Enter username" />
            <Input.ErrorMessage>This field is required.</Input.ErrorMessage>
          </Input.Root>
        </div>
        <div style={{ flex: '1 1 240px' }}>
          <p className="story-label">Label + description + error</p>
          <Input.Root isInvalid>
            <Input.Label>Password</Input.Label>
            <Input.Input type="password" />
            <Input.Description>Must be at least 8 characters long.</Input.Description>
            <Input.ErrorMessage>This field is required.</Input.ErrorMessage>
          </Input.Root>
        </div>
      </div>
    );
  },
};
