import { Given, Then, When } from '@cucumber/cucumber';
import { getUser } from '../data/users';
import { expect } from '../support/assertions';
import type { CustomWorld } from '../support/world';

Given('el usuario está en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.open();
});

Given(
  'el usuario inició sesión como {string}',
  async function (this: CustomWorld, username: string) {
    await this.loginPage.open();
    await this.loginPage.loginAs(getUser(username));
    await expect(this.page).toHaveURL(this.inventoryPage.url);
  },
);

When('inicia sesión como {string}', async function (this: CustomWorld, username: string) {
  await this.loginPage.loginAs(getUser(username));
});

When(
  'intenta iniciar sesión con usuario {string} y contraseña {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

Then('debería ver el catálogo de productos', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.inventoryPage.url);
  await expect(this.inventoryPage.title).toHaveText('Products');
  await expect(this.inventoryPage.productNames).not.toHaveCount(0);
});

Then(
  'debería ver el mensaje de error de inicio de sesión {string}',
  async function (this: CustomWorld, message: string) {
    await expect(this.loginPage.errorMessage).toHaveText(message);
  },
);

Then('debería permanecer en la página de inicio de sesión', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.loginPage.url);
  await expect(this.loginPage.loginButton).toBeVisible();
});
