import type { Locator, Page } from '@playwright/test';

/** Cabecera común a las páginas internas: acceso y contador del carrito. */
export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
