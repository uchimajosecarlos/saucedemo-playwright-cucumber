import { Then, When, type DataTable } from '@cucumber/cucumber';
import { expect } from '../support/assertions';
import type { CustomWorld } from '../support/world';

When('agrega el producto {string} al carrito', async function (this: CustomWorld, name: string) {
  await this.inventoryPage.addProductToCart(name);
  this.addedProducts.push(name);
});

When(
  'agrega los siguientes productos al carrito:',
  async function (this: CustomWorld, table: DataTable) {
    for (const { producto } of table.hashes()) {
      await this.inventoryPage.addProductToCart(producto);
      this.addedProducts.push(producto);
    }
  },
);

Then(
  'el botón del producto {string} debería cambiar a {string}',
  async function (this: CustomWorld, name: string, label: string) {
    await expect(this.inventoryPage.productButton(name)).toHaveText(label);
  },
);
