import * as React from 'react';
import { Field } from '@tale-ui/react/field';

function getError(value: string, hasChanged: boolean) {
  if (!hasChanged) {
    return null;
  }
  if (value === '') {
    return 'valueMissing';
  }
  if (value.length < 3) {
    return 'tooShort';
  }
  if (value === 'abcd') {
    return 'customError';
  }
  return null;
}

export default function InputValidateOnChange() {
  const [value, setValue] = React.useState('');
  const [hasChanged, setHasChanged] = React.useState(false);
  const error = getError(value, hasChanged);

  return (
    <Field.Root className="flex flex-col items-start gap-1">
      <Field.Control>
        <input
          required
          minLength={3}
          value={value}
          onChange={(event) => {
            setHasChanged(true);
            setValue(event.currentTarget.value);
          }}
          className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Control>
      <div data-testid="error" className="text-sm text-red-800" hidden={error !== 'valueMissing'}>
        valueMissing error
      </div>
      <div data-testid="error" className="text-sm text-red-800" hidden={error !== 'tooShort'}>
        tooShort error
      </div>
      <div data-testid="error" className="text-sm text-red-800" hidden={error !== 'customError'}>
        custom error
      </div>
    </Field.Root>
  );
}
