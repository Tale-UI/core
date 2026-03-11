import * as React from 'react';
import { Field } from '@tale-ui/react/field';

function App() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  return <Field.Control ref={ref} render={<textarea />} />;
}
