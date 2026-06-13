import { chromium, expect, Page, Browser } from '@playwright/test';
import { describe, it, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://localhost:5173';

function delay(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

/**
 * Attempts page.goto with retries
 *
 * @remarks The server and runner can be started up simultaneously
 * @param page
 * @param url
 */
async function attemptGoto(page: Page, url: string): Promise<boolean> {
  const maxAttempts = 10;
  const retryTimeoutMS = 250;

  let didNavigate = false;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await page.goto(url);
      didNavigate = true;
    } catch (error) {
      // eslint-disable-next-line no-await-in-loop
      await delay(retryTimeoutMS);
    }
  }

  return didNavigate;
}

describe('e2e', () => {
  let browser: Browser;
  let page: Page;

  async function renderFixture(fixturePath: string) {
    await page.goto(`${BASE_URL}/e2e-fixtures/${fixturePath}#no-dev`);
    await page.waitForSelector('[data-testid="testcase"]:not([aria-busy="true"])', {
      state: 'attached',
    });
  }

  beforeAll(async function beforeHook() {
    browser = await chromium.launch({
      headless: true,
    });
    page = await browser.newPage();
    const isServerRunning = await attemptGoto(page, `${BASE_URL}#no-dev`);
    if (!isServerRunning) {
      throw new Error(
        `Unable to navigate to ${BASE_URL} after multiple attempts. Did you forget to run \`pnpm test:e2e:server\` and \`pnpm test:e2e:build\`?`,
      );
    }
  }, 20000);

  afterAll(async () => {
    await browser.close();
  });

  describe('<Field />', () => {
    describe('validationMode=onChange', () => {
      it('<Field.Control />', async () => {
        await renderFixture('field/validate-on-change/Input');

        const valueMissingError = page.getByText('valueMissing error');
        const tooShortError = page.getByText('tooShort error');
        const customError = page.getByText('custom error');

        await expect(valueMissingError).toBeHidden();
        await expect(tooShortError).toBeHidden();
        await expect(customError).toBeHidden();

        const input = page.getByRole('textbox');

        await input.press('a');
        await expect(tooShortError).toBeVisible();

        // clear the input
        await input.press('Backspace');
        await expect(valueMissingError).toBeVisible();

        await input.pressSequentially('abc');
        await expect(input).toHaveValue('abc');
        await expect(valueMissingError).toBeHidden();
        await expect(tooShortError).toBeHidden();
        await expect(customError).toBeHidden();

        await input.press('d');
        await expect(input).toHaveValue('abcd');
        await expect(customError).toBeVisible();

        await input.press('Backspace');
        await expect(input).toHaveValue('abc');
        await expect(valueMissingError).toBeHidden();
        await expect(tooShortError).toBeHidden();
        await expect(customError).toBeHidden();

        await input.press('Backspace');
        await expect(input).toHaveValue('ab');
        await expect(tooShortError).toBeVisible();

        await input.press('Backspace');
        await input.press('Backspace');
        await expect(input).toHaveValue('');
        await expect(valueMissingError).toBeVisible();
      });

      it('<Select />', async () => {
        // options one & three returns errors
        // options two and four are valid
        // the field is required
        await renderFixture('field/validate-on-change/Select');

        const valueMissingError = page.getByText('valueMissing error');
        const errorOne = page.getByText('error one');
        const errorThree = page.getByText('error three');

        await expect(valueMissingError).toBeHidden();
        await expect(errorOne).toBeHidden();
        await expect(errorThree).toBeHidden();

        const trigger = page.locator('.tale-select__trigger');
        await expect(trigger).toHaveText('select');

        const options = page.getByRole('option');

        await trigger.click();
        await options.filter({ hasText: 'one' }).click();
        await expect(trigger).toHaveText('one');
        await expect(errorOne).toBeVisible();

        await trigger.click();
        await options.filter({ hasText: 'two' }).click();
        await expect(trigger).toHaveText('two');
        await expect(valueMissingError).toBeHidden();
        await expect(errorOne).toBeHidden();
        await expect(errorThree).toBeHidden();

        await trigger.click();
        // clear the value
        await options.filter({ hasText: 'select' }).click();
        await expect(trigger).toHaveText('select');
        await expect(valueMissingError).toBeVisible();

        await trigger.click();
        await options.filter({ hasText: 'three' }).click();
        await expect(trigger).toHaveText('three');
        await expect(errorThree).toBeVisible();

        await trigger.click();
        await options.filter({ hasText: 'four' }).click();
        await expect(trigger).toHaveText('four');
        await expect(valueMissingError).toBeHidden();
        await expect(errorOne).toBeHidden();
        await expect(errorThree).toBeHidden();
      });
    });
  });

  describe('<Radio />', () => {
    it('loops focus by default', async () => {
      await renderFixture('Radio');
      const one = page.getByRole('radio', { name: 'Fuji' });
      const two = page.getByRole('radio', { name: 'Gala' });
      const three = page.getByRole('radio', { name: 'Granny Smith' });

      await page.keyboard.press('Tab');
      await expect(one).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(two).toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await expect(one).toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await expect(three).toBeFocused();
    });
  });

  describe('<Slider />', () => {
    it('overlapping thumbs', async () => {
      await renderFixture('slider/Range');

      await page.getByRole('slider').nth(1).focus();
      await page.keyboard.press('End');

      await expect(page.getByRole('status')).toHaveText('25–100');
    });

    it('overlapping thumbs at max', async () => {
      await renderFixture('slider/RangeSliderMax');

      await page.getByRole('slider').nth(0).focus();
      await page.keyboard.press('Home');

      await expect(page.getByRole('status')).toHaveText('0–100');
    });

    it('inset thumbs', async () => {
      await renderFixture('slider/Inset');
      await expect(page.getByRole('status')).toHaveText('30');

      await page.getByRole('slider').focus();
      await page.keyboard.press('Home');
      await expect(page.getByRole('status')).toHaveText('0');
      await page.keyboard.press('End');
      await expect(page.getByRole('status')).toHaveText('100');
      await page.keyboard.press('ArrowLeft');
      await expect(page.getByRole('status')).toHaveText('99');
    });
  });

  describe('<Menu />', () => {
    describe('<Menu.LinkItem />', () => {
      it('navigates on click', async () => {
        await renderFixture('menu/LinkItemNavigation');

        const trigger = page.getByTestId('menu-trigger');
        await trigger.click();

        const linkOne = page.getByTestId('link-one');
        await linkOne.click();

        await expect(page).toHaveURL(/\/e2e-fixtures\/menu\/PageOne/);
        await expect(page.getByTestId('test-page')).toHaveText('Page one');

        await page.goBack();
        await expect(page.getByTestId('page-heading')).toHaveText('Menu with Link Items');

        await trigger.click();
        const linkTwo = page.getByTestId('link-two');
        await linkTwo.click();

        await expect(page).toHaveURL(/\/e2e-fixtures\/menu\/PageTwo/);
        await expect(page.getByTestId('test-page')).toHaveText('Page two');
      });

      it('navigates on Enter key press', async () => {
        await renderFixture('menu/LinkItemNavigation');

        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        // first item (page one) is initially highlighted
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await expect(page).toHaveURL(/\/e2e-fixtures\/menu\/PageTwo/);
        await expect(page.getByTestId('test-page')).toHaveText('Page two');
      });

      it('navigates when rendering React Router Link component', async () => {
        await renderFixture('menu/ReactRouterLinkItemNavigation');

        const trigger = page.getByTestId('menu-trigger');
        await trigger.click();

        const linkOne = page.getByTestId('link-one');
        await linkOne.click();

        await expect(page).toHaveURL(/\/e2e-fixtures\/menu\/PageOne/);
        await expect(page.getByTestId('test-page')).toHaveText('Page one');

        await page.goBack();
        await expect(page.getByTestId('page-heading')).toHaveText(
          'Menu with React Router Link Items',
        );

        await trigger.click();
        const linkTwo = page.getByTestId('link-two');
        await linkTwo.click();

        await expect(page).toHaveURL(/\/e2e-fixtures\/menu\/PageTwo/);
        await expect(page.getByTestId('test-page')).toHaveText('Page two');
      });
    });
  });
});
