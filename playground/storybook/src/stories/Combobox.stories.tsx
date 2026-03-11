import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@tale-ui/react/combobox';

const countries = ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'India'];

type Args = {
  disabled?: boolean;
  placeholder?: string;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Combobox',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    disabled: false,
    placeholder: 'Search country…',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | null>(null);
    const [items, setItems] = React.useState(countries);

    return (
      <div style={{ width: '28rem' }}>
      <Combobox.Root
        disabled={args.disabled}
        value={value}
        onValueChange={setValue}
        onInputValueChange={(val) => {
          setItems(countries.filter((c) => c.toLowerCase().includes(val.toLowerCase())));
        }}
      >
        <Combobox.Input className="tale-combobox__input" placeholder={args.placeholder} />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup className="tale-combobox__popup">
              <Combobox.List>
                {items.length === 0 ? (
                  <Combobox.Empty className="tale-combobox__empty">No results</Combobox.Empty>
                ) : (
                  items.map((country) => (
                    <Combobox.Item key={country} className="tale-combobox__item" value={country}>
                      {country}
                    </Combobox.Item>
                  ))
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      </div>
    );
  },
};

export const Multiple: Story = {
  name: 'Multiple Selection',
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    const [items, setItems] = React.useState(countries);

    return (
      <div style={{ width: '28rem' }}>
      <Combobox.Root
        multiple
        value={values}
        onValueChange={setValues}
        onInputValueChange={(val) => {
          setItems(countries.filter((c) => c.toLowerCase().includes(val.toLowerCase())));
        }}
      >
        <Combobox.Chips className="tale-combobox__chips">
          {values.map((v) => (
            <Combobox.Chip key={v} className="tale-combobox__chip">
              {v}
              <Combobox.ChipRemove className="tale-combobox__chip-remove" aria-label={`Remove ${v}`}>✕</Combobox.ChipRemove>
            </Combobox.Chip>
          ))}
        </Combobox.Chips>
        <Combobox.Input className="tale-combobox__input" placeholder="Search countries…" />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup className="tale-combobox__popup">
              <Combobox.List>
                {items.length === 0 ? (
                  <Combobox.Empty className="tale-combobox__empty">No results</Combobox.Empty>
                ) : (
                  items.map((country) => (
                    <Combobox.Item key={country} className="tale-combobox__item" value={country}>
                      {country}
                    </Combobox.Item>
                  ))
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      </div>
    );
  },
};
