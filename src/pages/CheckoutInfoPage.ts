import type { Locator, Page } from '@playwright/test';
import { expect } from '../support/assertions';
import { BasePage } from './BasePage';

export interface CustomerInfo {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}

/** Paso 1 del checkout: datos del cliente. */
export class CheckoutInfoPage extends BasePage {
  readonly url = /\/checkout-step-one\.html$/;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
  }

  /**
   * Llena el formulario y confirma que los tres valores quedaron escritos.
   * En WebKit el formulario puede reiniciarse justo después de montarse y borrar el primer
   * campo; si ocurre, se vuelve a llenar completo.
   */
  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await expect(async () => {
      await this.firstNameInput.fill(info.firstName);
      await this.lastNameInput.fill(info.lastName);
      await this.postalCodeInput.fill(info.postalCode);
      await expect(this.firstNameInput).toHaveValue(info.firstName, { timeout: 1_000 });
      await expect(this.lastNameInput).toHaveValue(info.lastName, { timeout: 1_000 });
      await expect(this.postalCodeInput).toHaveValue(info.postalCode, { timeout: 1_000 });
    }).toPass();
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }
}
