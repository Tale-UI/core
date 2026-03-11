import setupVitest from '@mui/internal-test-utils/setupVitest';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { reset } from '@tale-ui/utils/error';

declare global {
  // eslint-disable-next-line vars-on-top
  var TALE_UI_ANIMATIONS_DISABLED: boolean;
}

setupVitest();

afterEach(() => {
  vi.resetAllMocks();
  reset();
});

globalThis.TALE_UI_ANIMATIONS_DISABLED = true;

if (typeof window !== 'undefined' && window?.navigator?.userAgent?.includes('jsdom')) {
  globalThis.requestAnimationFrame = (cb) => {
    setTimeout(() => cb(0), 0);
    return 0;
  };
}
