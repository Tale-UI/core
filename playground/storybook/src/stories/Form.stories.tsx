import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from '@tale-ui/react/form';
import { TextField } from '@tale-ui/react/text-field';
import { NumberField } from '@tale-ui/react/number-field';
import { Button } from '@tale-ui/react/button';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Form',
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <div className="story-narrow">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <div className="story-col story-col--m">
          <TextField.Root name="username" isRequired>
            <TextField.Label>Username</TextField.Label>
            <TextField.Input placeholder="Enter username" />
          </TextField.Root>
          <TextField.Root name="email" type="email" isRequired>
            <TextField.Label>Email</TextField.Label>
            <TextField.Input placeholder="you@example.com" />
          </TextField.Root>
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </div>
  ),
};

export const WithValidation: Story = {
  render: () => (
    <div className="story-narrow">
      <Form
        validationBehavior="native"
        onSubmit={(e) => {
          e.preventDefault();
          alert('Validation passed — form submitted!');
        }}
      >
        <div className="story-col story-col--m">
          <TextField.Root name="fullName" isRequired>
            <TextField.Label>Full Name</TextField.Label>
            <TextField.Input placeholder="Enter your full name" />
          </TextField.Root>
          <TextField.Root name="password" type="password" isRequired minLength={8}>
            <TextField.Label>Password</TextField.Label>
            <TextField.Input placeholder="At least 8 characters" />
          </TextField.Root>
          <NumberField.Root name="age" minValue={18} maxValue={120}>
            <NumberField.Label>Age</NumberField.Label>
            <NumberField.Input placeholder="Must be 18+" />
          </NumberField.Root>
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ flex: '1 1 280px' }}>
          <p className="story-label">Valid form</p>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Form submitted!');
            }}
          >
            <div className="story-col story-col--m">
              <TextField.Root name="username" isRequired>
                <TextField.Label>Username</TextField.Label>
                <TextField.Input placeholder="Enter username" />
              </TextField.Root>
              <TextField.Root name="email" type="email" isRequired>
                <TextField.Label>Email</TextField.Label>
                <TextField.Input placeholder="you@example.com" />
              </TextField.Root>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
        <div style={{ flex: '1 1 280px' }}>
          <p className="story-label">Invalid form (with validation errors)</p>
          <Form
            validationBehavior="native"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="story-col story-col--m">
              <TextField.Root name="fullName" isRequired isInvalid>
                <TextField.Label>Full Name</TextField.Label>
                <TextField.Input placeholder="Enter your full name" />
                <TextField.ErrorMessage>This field is required.</TextField.ErrorMessage>
              </TextField.Root>
              <TextField.Root name="password" type="password" isRequired isInvalid>
                <TextField.Label>Password</TextField.Label>
                <TextField.Input placeholder="At least 8 characters" />
                <TextField.ErrorMessage>Password must be at least 8 characters.</TextField.ErrorMessage>
              </TextField.Root>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  },
};
