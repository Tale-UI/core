import { createRenderer } from '@tale-ui/monorepo-tests/test-utils';
import { Fieldset } from '@tale-ui/react/fieldset';
import { describeConformance } from '../../../test/describeConformance';

describe('<Fieldset.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<Fieldset.Root />, () => ({
    inheritComponent: 'fieldset',
    refInstanceof: window.HTMLFieldSetElement,
    render,
  }));
});
