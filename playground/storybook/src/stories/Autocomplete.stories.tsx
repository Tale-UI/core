import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete } from '@tale-ui/react/autocomplete';

const suggestions = ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Preact', 'Qwik', 'Remix', 'Next.js', 'Nuxt'];

type Args = {
  disabled?: boolean;
  placeholder?: string;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Autocomplete',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    disabled: false,
    placeholder: 'Search frameworks…',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | undefined>(undefined);

    return (
      <div style={{ width: '28rem' }}>
        <Autocomplete.Root
          disabled={args.disabled}
          items={suggestions}
          value={value}
          onValueChange={setValue}
        >
          <Autocomplete.Input className="tale-autocomplete__input" placeholder={args.placeholder} />
          <Autocomplete.Portal>
            <Autocomplete.Positioner sideOffset={4}>
              <Autocomplete.Popup className="tale-autocomplete__popup">
                <Autocomplete.List>
                  <Autocomplete.Empty className="tale-autocomplete__empty">No results found</Autocomplete.Empty>
                  {suggestions.map((item) => (
                    <Autocomplete.Item key={item} className="tale-autocomplete__item" value={item}>
                      {item}
                    </Autocomplete.Item>
                  ))}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </div>
    );
  },
};
