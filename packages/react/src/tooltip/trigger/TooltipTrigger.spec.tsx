import type * as React from 'react';
import { Tooltip } from '@tale-ui/react/tooltip';

// `props: any` will error
<Tooltip.Trigger render={(props) => <button type="button" {...props} />} />;
<Tooltip.Trigger render={(props) => <input {...props} />} />;
