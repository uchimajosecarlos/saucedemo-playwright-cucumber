import { Then, When } from '@cucumber/cucumber';
import { expect } from '../support/assertions';
import type { CustomWorld } from '../support/world';

When('continúa con el checkout', async function (this: CustomWorld) {
  await this.cartPage.checkout();
  await expect(this.page).toHaveURL(this.checkoutInfoPage.url);
});

When(
  'completa sus datos con nombre {string}, apellido {string} y código postal {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutInfoPage.fillCustomerInfo({ firstName, lastName, postalCode });
    await this.checkoutInfoPage.continueToOverview();
  },
);

When('finaliza la compra', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.finish();
});

Then(
  'debería ver el mensaje de error del formulario {string}',
  async function (this: CustomWorld, message: string) {
    await expect(this.checkoutInfoPage.errorMessage).toHaveText(message);
    await expect(this.page).toHaveURL(this.checkoutInfoPage.url);
  },
);

Then('el resumen debería listar los productos agregados', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.checkoutOverviewPage.url);
  await expect(this.checkoutOverviewPage.itemNames).toHaveText(this.addedProducts);
});

Then(
  'el total de artículos debería ser la suma de los precios',
  async function (this: CustomWorld) {
    const prices = await this.checkoutOverviewPage.getItemPrices();
    const subtotal = await this.checkoutOverviewPage.getSubtotal();
    expect(subtotal).toBe(prices.reduce((sum, price) => sum + price, 0));
  },
);

Then(
  'el total a pagar debería ser el total de artículos más el impuesto',
  async function (this: CustomWorld) {
    const subtotal = await this.checkoutOverviewPage.getSubtotal();
    const tax = await this.checkoutOverviewPage.getTax();
    const total = await this.checkoutOverviewPage.getTotal();
    expect(tax).toBeGreaterThan(0);
    expect(total).toBe(subtotal + tax);
  },
);

Then(
  'debería ver el mensaje de confirmación {string}',
  async function (this: CustomWorld, message: string) {
    await expect(this.page).toHaveURL(this.checkoutCompletePage.url);
    await expect(this.checkoutCompletePage.confirmationHeader).toHaveText(message);
  },
);
