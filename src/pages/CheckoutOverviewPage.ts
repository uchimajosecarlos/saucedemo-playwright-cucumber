import type { Locator, Page } from '@playwright/test';
import { parseCents } from '../utils/money';
import { BasePage } from './BasePage';

/** Paso 2 del checkout: resumen de la compra. Los importes se devuelven en centavos. */
export class CheckoutOverviewPage extends BasePage {
  readonly url = /\/checkout-step-two\.html$/;

  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async getItemPrices(): Promise<number[]> {
    await this.itemPrices.first().waitFor();
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map(parseCents);
  }

  async getSubtotal(): Promise<number> {
    return parseCents(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return parseCents(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return parseCents(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
