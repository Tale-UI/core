import { Fieldset } from '@tale-ui/react/fieldset';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Fieldset.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<Fieldset.Root />, () => ({
    inheritComponent: 'fieldset',
    refInstanceof: window.HTMLFieldSetElement,
    render,
  }));
});
