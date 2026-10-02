import path from 'node:path';
import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, selectors, webkit, type Browser } from '@playwright/test';
import { config } from './config';
import type { CustomWorld } from './world';

const launchers = { chromium, firefox, webkit };

// Tiempo máximo de un paso completo (puede incluir varias acciones con su propio timeout).
setDefaultTimeout(config.defaultTimeout * 4);

let browser: Browser;

function toFileName(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Un navegador por worker; cada escenario usa su propio contexto aislado.
BeforeAll(async function () {
  selectors.setTestIdAttribute('data-test');
  browser = await launchers[config.browser].launch({
    headless: config.headless,
    slowMo: config.slowMo,
  });
});

Before(async function (this: CustomWorld, { pickle }) {
  this.context = await browser.newContext({ baseURL: config.baseUrl });
  this.context.setDefaultTimeout(config.defaultTimeout);
  if (config.trace !== 'off') {
    await this.context.tracing.start({ title: pickle.name, screenshots: true, snapshots: true });
  }
  this.initPages(await this.context.newPage());
});

After(async function (this: CustomWorld, { pickle, result }) {
  const failed = result?.status === Status.FAILED;
  try {
    if (failed) {
      this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
    }
    if (config.trace === 'on' || (config.trace === 'retain-on-failure' && failed)) {
      // Un archivo por navegador y escenario: una nueva ejecución reemplaza al anterior.
      const tracePath = path.join(
        'reports',
        'traces',
        config.browser,
        `${toFileName(pickle.name)}.zip`,
      );
      await this.context.tracing.stop({ path: tracePath });
      this.attach(`Trace de Playwright: ${tracePath}`, 'text/plain');
    } else if (config.trace !== 'off') {
      await this.context.tracing.stop();
    }
  } finally {
    await this.context.close();
  }
});

AfterAll(async function () {
  await browser.close();
});
