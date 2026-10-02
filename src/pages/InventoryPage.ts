import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Catálogo de productos. */
export class InventoryPage extends BasePage {
  readonly url = /\/inventory\.html$/;

  readonly productNames: Locator;

  constructor(page: Page) {
    super(page);
    this.productNames = page.getByTestId('inventory-item-name');
  }

  /**
   * Botón de carrito de la tarjeta del producto ("Add to cart" o "Remove").
   * Se filtra por nombre porque la imagen y el título también tienen rol de botón.
   */
  productButton(name: string): Locator {
    return this.itemByName(name).getByRole('button', { name: /^(Add to cart|Remove)$/ });
  }

  async addProductToCart(name: string): Promise<void> {
    await this.itemByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }
}
