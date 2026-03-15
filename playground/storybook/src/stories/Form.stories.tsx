import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '@tale-ui/react/form';
import { Button } from '@tale-ui/react/button';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Form',
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: 'var(--space-m)' }}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>
              Username
            </label>
            <input className="tale-input" name="username" required placeholder="Enter username" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>
              Email
            </label>
            <input
              className="tale-input"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </div>
  ),
};

export const WithValidation: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: 'var(--space-m)' }}>
      <Form
        validationBehavior="native"
        onSubmit={(e) => {
          e.preventDefault();
          alert('Validation passed — form submitted!');
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>
              Full Name
            </label>
            <input
              className="tale-input"
              name="fullName"
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>
              Password
            </label>
            <input
              className="tale-input"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>
              Age
            </label>
            <input
              className="tale-input"
              name="age"
              type="number"
              min={18}
              max={120}
              placeholder="Must be 18+"
            />
          </div>
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </div>
  ),
};
