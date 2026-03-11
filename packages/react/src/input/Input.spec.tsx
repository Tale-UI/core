import * as React from 'react';
import { Input } from '@tale-ui/react/input';

function App() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  return <Input ref={ref} render={<textarea />} />;
}
