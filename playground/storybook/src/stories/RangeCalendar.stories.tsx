import type { Meta, StoryObj } from '@storybook/react';
import { RangeCalendar } from '@tale-ui/react/range-calendar';

type Args = {
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/RangeCalendar',
  parameters: { layout: 'centered' },
  argTypes: {
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <RangeCalendar.Root {...args}>
      <RangeCalendar.Header>
        <RangeCalendar.PreviousButton />
        <RangeCalendar.Heading />
        <RangeCalendar.NextButton />
      </RangeCalendar.Header>
      <RangeCalendar.Grid>
        <RangeCalendar.GridHeader>
          {(day) => (
            <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>
          )}
        </RangeCalendar.GridHeader>
        <RangeCalendar.GridBody>
          {(date) => <RangeCalendar.Cell date={date} />}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    </RangeCalendar.Root>
  ),
};


export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-sections">
        <div>
          <p className="story-label">Default range calendar</p>
          <RangeCalendar.Root>
            <RangeCalendar.Header>
              <RangeCalendar.PreviousButton />
              <RangeCalendar.Heading />
              <RangeCalendar.NextButton />
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => (
                  <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>
                )}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar.Root>
        </div>
      </div>
    );
  },
};
