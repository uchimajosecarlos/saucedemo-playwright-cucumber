import { Then, When, type DataTable } from '@cucumber/cucumber';
import { expect } from '../support/assertions';
import type { CustomWorld } from '../support/world';

When('abre el carrito', async function (this: CustomWorld) {
  await this.header.openCart();
  await expect(this.page).toHaveURL(this.cartPage.url);
});

When('quita el producto {string} del carrito', async function (this: CustomWorld, name: string) {
  await this.cartPage.removeProduct(name);
});

Then(
  'el contador del carrito debería mostrar {string}',
  async function (this: CustomWorld, count: string) {
    await expect(this.header.cartBadge).toHaveText(count);
  },
);

Then(
  'el carrito debería contener exactamente:',
  async function (this: CustomWorld, table: DataTable) {
    const rows = table.hashes();
    await expect(this.cartPage.itemNames).toHaveText(rows.map((row) => row.producto));
    await expect(this.cartPage.itemPrices).toHaveText(rows.map((row) => row.precio));
  },
);

Then(
  'el carrito no debería contener el producto {string}',
  async function (this: CustomWorld, name: string) {
    await expect(this.cartPage.item(name)).toHaveCount(0);
  },
);

Then('el carrito debería quedar vacío', async function (this: CustomWorld) {
  await expect(this.header.cartBadge).toHaveCount(0);
});
