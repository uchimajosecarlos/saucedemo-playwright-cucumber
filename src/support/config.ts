import { config as loadEnv } from 'dotenv';

loadEnv({ quiet: true });

const BROWSERS = ['chromium', 'firefox', 'webkit'] as const;

export type BrowserName = (typeof BROWSERS)[number];

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value === '' ? undefined : value;
}

function isBrowserName(value: string): value is BrowserName {
  return (BROWSERS as readonly string[]).includes(value);
}

function readBrowser(): BrowserName {
  const value = (readEnv('BROWSER') ?? 'chromium').toLowerCase();
  if (!isBrowserName(value)) {
    throw new Error(`BROWSER inválido: "${value}". Valores permitidos: ${BROWSERS.join(', ')}.`);
  }
  return value;
}

const TRACE_MODES = ['retain-on-failure', 'on', 'off'] as const;

export type TraceMode = (typeof TRACE_MODES)[number];

function isTraceMode(value: string): value is TraceMode {
  return (TRACE_MODES as readonly string[]).includes(value);
}

function readTraceMode(): TraceMode {
  const value = (readEnv('TRACE') ?? 'retain-on-failure').toLowerCase();
  if (!isTraceMode(value)) {
    throw new Error(`TRACE inválido: "${value}". Valores permitidos: ${TRACE_MODES.join(', ')}.`);
  }
  return value;
}

function readMilliseconds(name: string, fallback: number, min: number): number {
  const raw = readEnv(name);
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min) {
    throw new Error(
      `${name} inválido: "${raw}". Debe ser un entero mayor o igual a ${min} (milisegundos).`,
    );
  }
  return value;
}

/** Configuración de la ejecución, leída de variables de entorno (o de `.env`). */
export const config = {
  baseUrl: readEnv('BASE_URL') ?? 'https://www.saucedemo.com',
  browser: readBrowser(),
  headless: readEnv('HEADLESS')?.toLowerCase() !== 'false',
  /** Pausa entre acciones del navegador, para seguir la ejecución a simple vista. */
  slowMo: readMilliseconds('SLOW_MO', 0, 0),
  defaultTimeout: readMilliseconds('DEFAULT_TIMEOUT', 15_000, 1),
  trace: readTraceMode(),
  password: readEnv('SAUCE_PASSWORD') ?? 'secret_sauce',
} as const;
