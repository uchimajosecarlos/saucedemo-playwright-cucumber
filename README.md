# Sauce Demo · Pruebas E2E con Playwright y Cucumber

[![E2E Tests](https://github.com/uchimajosecarlos/saucedemo-playwright-cucumber/actions/workflows/e2e.yml/badge.svg)](https://github.com/uchimajosecarlos/saucedemo-playwright-cucumber/actions/workflows/e2e.yml)

Suite de pruebas automatizadas para [Sauce Demo](https://www.saucedemo.com/) escrita en
**TypeScript** con **Playwright** y **Cucumber** (Gherkin con palabras clave en inglés y pasos en
español), siguiendo el patrón **Page Object Model**.

Cubre la historia de usuario: _como cliente de Sauce Demo, quiero iniciar sesión, agregar productos
al carrito y completar una compra, para adquirir los productos que necesito._

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Instalación

```bash
git clone https://github.com/uchimajosecarlos/saucedemo-playwright-cucumber.git
cd saucedemo-playwright-cucumber
npm install
npx playwright install chromium
```

Para ejecutar en Firefox o WebKit, instalar también esos navegadores:
`npx playwright install firefox webkit`.

## Ejecución

| Comando                                                 | Descripción                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| `npm test`                                              | Suite completa en Chromium sin interfaz                                  |
| `npm run test:smoke`                                    | Solo los escenarios `@smoke`                                             |
| `npm run test:headed`                                   | Suite completa con el navegador visible y pausa de 500 ms entre acciones |
| `npm run test:parallel`                                 | Suite completa con 4 escenarios en paralelo                              |
| `npm run test:firefox`                                  | Suite completa en Firefox                                                |
| `npm run test:webkit`                                   | Suite completa en WebKit                                                 |
| `npm run test:trace`                                    | Suite completa guardando el trace de todos                               |
| `npm run snippets`                                      | Genera el código base de los pasos que aún no tienen step definition     |
| `npm test -- --tags "@cart and not @negative"`          | Filtrar por tags                                                         |
| `npm test -- features/login.feature`                    | Un solo feature                                                          |
| `npm run lint` · `npm run format` · `npm run typecheck` | Calidad de código                                                        |

### Tags disponibles

`@smoke`, `@regression`, `@e2e`, `@negative`, `@login`, `@cart`, `@checkout`.

## Configuración

Todas las variables son opcionales. Para cambiarlas, copiar `.env.example` como `.env`:

| Variable          | Valor por defecto           | Descripción                                                       |
| ----------------- | --------------------------- | ----------------------------------------------------------------- |
| `BASE_URL`        | `https://www.saucedemo.com` | URL de la aplicación                                              |
| `BROWSER`         | `chromium`                  | `chromium`, `firefox` o `webkit`                                  |
| `HEADLESS`        | `true`                      | `false` para ver el navegador                                     |
| `SLOW_MO`         | `0`                         | Pausa entre acciones (ms) para seguir la ejecución a simple vista |
| `DEFAULT_TIMEOUT` | `15000`                     | Timeout de acciones y aserciones (ms)                             |
| `TRACE`           | `retain-on-failure`         | `retain-on-failure`, `on` u `off`                                 |
| `SAUCE_PASSWORD`  | `secret_sauce`              | Contraseña de los usuarios de prueba                              |

## Reportes

Cada ejecución genera:

- `reports/cucumber-report.html`: reporte navegable con escenarios, pasos y duración.
- `reports/cucumber-report.json`: el mismo resultado en JSON para otras herramientas.

Si un escenario falla, se adjunta una **captura de pantalla** al reporte.

### Traces de Playwright

Un trace registra cada acción del escenario con capturas, el DOM antes y después, la red y la
consola. Se guardan en `reports/traces/<navegador>/<escenario>.zip` según la variable `TRACE`:

| `TRACE`             | Cuándo se guarda                                |
| ------------------- | ----------------------------------------------- |
| `retain-on-failure` | Solo de los escenarios que fallan (por defecto) |
| `on`                | De todos los escenarios (`npm run test:trace`)  |
| `off`               | Nunca; la suite corre un poco más rápido        |

El repositorio incluye en `reports/traces/chromium/` los traces de una ejecución completa con
`TRACE=on`, como evidencia del recorrido de cada escenario. Para abrir uno:

```bash
npx playwright show-trace reports/traces/chromium/un-cliente-estandar-compra-dos-productos-de-principio-a-fin.zip
```

También se pueden arrastrar a [trace.playwright.dev](https://trace.playwright.dev), que los abre en
el navegador sin enviarlos a ningún servidor.

En GitHub Actions el reporte y los traces quedan como artefacto `cucumber-report` de cada ejecución.

## Cobertura de los criterios de aceptación

| Criterio de aceptación                              | Feature                                  | Escenario                                                       |
| --------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| 1. Iniciar sesión con credenciales válidas          | `login.feature`                          | Inicio de sesión exitoso con usuario estándar                   |
| 2. No iniciar sesión con credenciales inválidas     | `login.feature`                          | Inicio de sesión rechazado (5 casos, incluye `locked_out_user`) |
| 3. Agregar un producto desde la página de productos | `carrito.feature`                        | Agregar un producto desde la página de productos                |
| 4. Ver los productos agregados en el carrito        | `carrito.feature`                        | Ver en el carrito los productos agregados                       |
| 5. Completar la compra hasta la confirmación        | `checkout.feature`, `compra-e2e.feature` | Completar la compra hasta la confirmación; flujo completo       |

Escenarios adicionales: quitar productos del carrito, validación de totales e impuesto, y campos
obligatorios del checkout. En total, 15 ejecuciones, verificadas en Chromium, Firefox y WebKit.

## Estructura del proyecto

```
features/                 Escenarios en Gherkin
src/
  pages/                  Page Objects (una clase por pantalla)
    components/           Componentes compartidos (cabecera)
  steps/                  Step definitions por dominio
  support/                World, hooks, configuración y aserciones
  data/                   Usuarios de prueba
  utils/                  Utilidades (importes)
docs/ESTRATEGIA.md        Estrategia de automatización y patrones
.github/workflows/        Integración continua
```

## Estrategia y patrones

Ver [docs/ESTRATEGIA.md](docs/ESTRATEGIA.md).
