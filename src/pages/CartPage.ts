import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly url = /\/cart\.html$/;

  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.checkoutButton = page.getByTestId('checkout');
  }

  item(name: string): Locator {
    return this.itemByName(name);
  }

  async removeProduct(name: string): Promise<void> {
    await this.itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
