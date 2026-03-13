import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '@tale-ui/react-styled/form';
import { Field } from '@tale-ui/react-styled/field';
import { Input } from '@tale-ui/react-styled/input';
import { Button } from '@tale-ui/react-styled/button';

type Args = {
  disabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Form/Form',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '36rem' }}>
      <Form
       
        onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}
      >
        <Field.Root disabled={args.disabled}>
          <Field.Label>Name</Field.Label>
          <Input name="name" required placeholder="Your name" disabled={args.disabled} />
          <Field.Error />
        </Field.Root>
        <Field.Root disabled={args.disabled}>
          <Field.Label>Email</Field.Label>
          <Input name="email" type="email" required placeholder="you@example.com" disabled={args.disabled} />
          <Field.Error />
        </Field.Root>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.2rem' }}>
          <Button variant="neutral" type="reset" disabled={args.disabled}>Reset</Button>
          <Button variant="primary" type="submit" disabled={args.disabled}>Submit</Button>
        </div>
      </Form>
    </div>
  ),
};

export const WithErrors: Story = {
  name: 'With Validation Errors',
  render: () => {
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const newErrors: Record<string, string> = {};
      if (!data.get('name')) newErrors.name = 'Name is required.';
      if (!data.get('email')) newErrors.email = 'Email is required.';
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) alert('Submitted!');
    };
    return (
      <div style={{ width: '36rem' }}>
        <Form onSubmit={handleSubmit}>
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Name *</Field.Label>
            <Input name="name" placeholder="Your name" />
            {errors.name && <Field.Error>{errors.name}</Field.Error>}
          </Field.Root>
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email *</Field.Label>
            <Input name="email" type="email" placeholder="you@example.com" />
            {errors.email && <Field.Error>{errors.email}</Field.Error>}
          </Field.Root>
          <Button variant="primary" type="submit">Submit (try with empty fields)</Button>
        </Form>
      </div>
    );
  },
};
