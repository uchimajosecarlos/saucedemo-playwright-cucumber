import type { Locator, Page } from '@playwright/test';

/** Comportamiento común a todas las páginas de Sauce Demo. */
export abstract class BasePage {
  /** Patrón de URL que identifica la página. */
  abstract readonly url: RegExp;

  readonly title: Locator;

  constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
  }

  /** Tarjeta de un producto (catálogo, carrito o resumen) por su nombre exacto. */
  protected itemByName(name: string): Locator {
    return this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByText(name, { exact: true }) });
  }
}
