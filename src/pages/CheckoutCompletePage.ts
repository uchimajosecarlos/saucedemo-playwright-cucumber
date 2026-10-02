import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Confirmación de la compra. */
export class CheckoutCompletePage extends BasePage {
  readonly url = /\/checkout-complete\.html$/;

  readonly confirmationHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }
}
