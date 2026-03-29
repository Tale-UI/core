import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@tale-ui/react/field';

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
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <Field.Control>
          <input className="tale-input" type="password" />
        </Field.Control>
        <Field.Description>Must be at least 8 characters long.</Field.Description>
        <Field.Error>This field is required.</Field.Error>
      </Field.Root>
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
          <Field.Root>
            <Field.Label>Username</Field.Label>
            <Field.Control>
              <input className="tale-input" placeholder="Enter username" />
            </Field.Control>
            <Field.Error>This field is required.</Field.Error>
          </Field.Root>
        </div>
        <div style={{ flex: '1 1 240px' }}>
          <p className="story-label">Label + description + error</p>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Field.Control>
              <input className="tale-input" type="password" />
            </Field.Control>
            <Field.Description>Must be at least 8 characters long.</Field.Description>
            <Field.Error>This field is required.</Field.Error>
          </Field.Root>
        </div>
      </div>
    );
  },
};
