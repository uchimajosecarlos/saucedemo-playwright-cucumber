import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { HeaderComponent } from '../pages/components/HeaderComponent';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

/** Estado de un escenario: navegador, página, page objects y datos compartidos entre pasos. */
export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;

  header!: HeaderComponent;
  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutInfoPage!: CheckoutInfoPage;
  checkoutOverviewPage!: CheckoutOverviewPage;
  checkoutCompletePage!: CheckoutCompletePage;

  /** Productos agregados al carrito durante el escenario, en orden. */
  readonly addedProducts: string[] = [];

  /** Page Factory: crea una sola vez los page objects del escenario sobre la página dada. */
  initPages(page: Page): void {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutInfoPage = new CheckoutInfoPage(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
  }
}

setWorldConstructor(CustomWorld);
