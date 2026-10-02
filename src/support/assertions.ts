import { expect as baseExpect } from '@playwright/test';
import { config } from './config';

/** `expect` web-first de Playwright con el timeout configurado para el proyecto. */
export const expect = baseExpect.configure({ timeout: config.defaultTimeout });
