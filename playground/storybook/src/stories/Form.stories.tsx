import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '@tale-ui/react/form';
import { Field } from '@tale-ui/react/field';
import { Input } from '@tale-ui/react/input';
import { Button } from '@tale-ui/react/button';

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
        className="tale-form"
        onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}
      >
        <Field.Root className="tale-field" disabled={args.disabled}>
          <Field.Label className="tale-field__label">Name</Field.Label>
          <Input className="tale-input" name="name" required placeholder="Your name" disabled={args.disabled} />
          <Field.Error className="tale-field__error" />
        </Field.Root>
        <Field.Root className="tale-field" disabled={args.disabled}>
          <Field.Label className="tale-field__label">Email</Field.Label>
          <Input className="tale-input" name="email" type="email" required placeholder="you@example.com" disabled={args.disabled} />
          <Field.Error className="tale-field__error" />
        </Field.Root>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.2rem' }}>
          <Button className="tale-button tale-button--neutral" type="reset" disabled={args.disabled}>Reset</Button>
          <Button className="tale-button tale-button--primary" type="submit" disabled={args.disabled}>Submit</Button>
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
        <Form className="tale-form" onSubmit={handleSubmit}>
          <Field.Root className="tale-field" invalid={!!errors.name}>
            <Field.Label className="tale-field__label">Name *</Field.Label>
            <Input className="tale-input" name="name" placeholder="Your name" />
            {errors.name && <Field.Error className="tale-field__error">{errors.name}</Field.Error>}
          </Field.Root>
          <Field.Root className="tale-field" invalid={!!errors.email}>
            <Field.Label className="tale-field__label">Email *</Field.Label>
            <Input className="tale-input" name="email" type="email" placeholder="you@example.com" />
            {errors.email && <Field.Error className="tale-field__error">{errors.email}</Field.Error>}
          </Field.Root>
          <Button className="tale-button tale-button--primary" type="submit">Submit (try with empty fields)</Button>
        </Form>
      </div>
    );
  },
};
