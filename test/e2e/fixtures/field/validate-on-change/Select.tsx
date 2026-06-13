import * as React from 'react';
import { Field } from '@tale-ui/react/field';
import { Select } from '@tale-ui/react/select';

const items = [
  { label: 'select', id: 'select' },
  { label: 'one', id: 'one' },
  { label: 'two', id: 'two' },
  { label: 'three', id: 'three' },
  { label: 'four', id: 'four' },
];

function getError(selectedKey: string | null, hasChanged: boolean) {
  if (hasChanged && selectedKey == null) {
    return 'valueMissing';
  }
  if (selectedKey === 'one') {
    return 'errorOne';
  }
  if (selectedKey === 'three') {
    return 'errorThree';
  }
  return null;
}

export default function SelectValidateOnChange() {
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [hasChanged, setHasChanged] = React.useState(false);
  const error = getError(selectedKey, hasChanged);

  return (
    <Field.Root className="flex flex-col items-start gap-1">
      <Select.Root
        items={items}
        isRequired
        placeholder="select"
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          setHasChanged(true);
          setSelectedKey(key === 'select' ? null : String(key));
        }}
      >
        <Select.Trigger className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100 cursor-default">
          <Select.Value />
        </Select.Trigger>
        <Select.Popover className="group origin-[var(--transform-origin)] bg-clip-padding rounded-md bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
          <Select.ListBox className="relative py-1 scroll-py-6 overflow-y-auto max-h-[var(--available-height)]">
            {items.map(({ label, id }) => (
              <Select.Item
                key={label}
                id={id}
                textValue={label}
                className="min-w-[var(--trigger-width)] cursor-default items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--trigger-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[focused]:relative data-[focused]:z-0 data-[focused]:text-gray-50 data-[focused]:before:absolute data-[focused]:before:inset-x-1 data-[focused]:before:inset-y-0 data-[focused]:before:z-[-1] data-[focused]:before:rounded-sm data-[focused]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
              >
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>
      <div data-testid="error" className="text-sm text-red-800" hidden={error !== 'valueMissing'}>
        valueMissing error
      </div>
      <div data-testid="error" className="text-sm text-red-800" hidden={error !== 'errorOne'}>
        error one
      </div>
      <div data-testid="error" className="text-sm text-red-800" hidden={error !== 'errorThree'}>
        error three
      </div>
    </Field.Root>
  );
}
