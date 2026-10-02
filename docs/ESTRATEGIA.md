# Estrategia de automatización

## 1. Enfoque

Las pruebas siguen **BDD**: cada criterio de aceptación de la historia de usuario se expresa como un
escenario en Gherkin. Las palabras clave (`Feature`, `Scenario`, `Given`, `When`, `Then`) se
mantienen en inglés, el estándar que reconocen todas las herramientas y equipos, y el texto de los
pasos está en español para que cualquier persona del negocio pueda leerlo y validarlo. Los mensajes
que muestra la aplicación se comparan con su texto literal en inglés.

**Cucumber** ejecuta los escenarios y **Playwright** controla el navegador. Se eligió Cucumber como
runner (en lugar de adaptar los features al runner de Playwright) para mantener el modelo completo de
Cucumber: World, hooks, tags, tablas de datos, esquemas de escenario y su reporte HTML.

## 2. Patrones de diseño

- **Page Object Model.** Cada pantalla tiene su clase en `src/pages` con los selectores y las acciones
  de negocio (`addProductToCart`, `fillCustomerInfo`). Ningún selector aparece fuera de estas clases.
- **Componentes.** La cabecera (carrito y su contador) se comparte entre pantallas como
  `HeaderComponent`, en lugar de duplicarse en cada página.
- **Clase base.** `BasePage` concentra lo común: el título de la pantalla y la búsqueda de un producto
  por su nombre, usada por el catálogo, el carrito y el resumen.
- **Page Factory en el World.** El `CustomWorld` de Cucumber crea los page objects una vez por
  escenario; los pasos los usan directamente (`this.cartPage`) sin instanciarlos.
- **Steps delgados.** Las step definitions solo traducen el lenguaje de negocio a llamadas de los page
  objects y hacen las aserciones. La lógica de interacción vive en las páginas.

## 3. Selección de escenarios

| Grupo            | Qué cubre                                                                             | Por qué                                                                            |
| ---------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Inicio de sesión | Usuario válido; bloqueado, contraseña incorrecta, usuario inexistente y campos vacíos | CA1 y CA2, y los dos tipos de usuario pedidos (`standard_user`, `locked_out_user`) |
| Carrito          | Agregar uno, varios (con precios) y quitar                                            | CA3 y CA4, y que el contador refleje el estado real                                |
| Checkout         | Totales, campos obligatorios y confirmación                                           | CA5; el cálculo del total es el riesgo de negocio más alto                         |
| Compra completa  | La historia de usuario de principio a fin                                             | Valida la integración de todos los pasos                                           |

Los casos negativos usan **Esquemas del escenario** para cubrir varias variantes sin duplicar pasos.
Los escenarios se organizan con tags (`@smoke`, `@regression`, `@negative`, por funcionalidad) para
ejecutar subconjuntos según la necesidad.

No se incluyeron `problem_user`, `performance_glitch_user`, `error_user` ni `visual_user`: tienen
fallas intencionales y el alcance pedido son los usuarios estándar y bloqueado.

## 4. Datos y selectores

- **Selectores estables:** los atributos `data-test` de la aplicación, vía `getByTestId`. No se usan
  clases CSS ni XPath.
- **Productos por nombre:** se ubican por el texto visible del producto, no por identificadores
  internos, para que los escenarios hablen el mismo idioma que el negocio.
- **Credenciales centralizadas** en `src/data/users.ts`; la contraseña puede venir de una variable de
  entorno.
- **Importes en centavos:** los precios se convierten a enteros antes de sumar, evitando errores de
  punto flotante al validar subtotal, impuesto y total.

## 5. Estabilidad y aislamiento

- Esperas automáticas de Playwright y aserciones _web-first_ que reintentan hasta cumplirse. No hay
  esperas fijas (`sleep`).
- Cada escenario usa un contexto de navegador nuevo: sin cookies, sesión ni carrito heredados. Esto
  permite ejecutar en paralelo (`npm run test:parallel`).
- Un navegador por proceso, reutilizado entre escenarios, para reducir el tiempo de ejecución.
- En CI se reintenta una vez un escenario fallido para absorber fallas de red de un sitio público; en
  local no hay reintentos, para no ocultar inestabilidad.

### Caso real: formulario de checkout en WebKit

Al ejecutar la suite en WebKit, los escenarios del formulario de checkout fallaban de forma
intermitente (2 de cada 8 corridas) con el mensaje _"First Name is required"_, aunque el nombre se
había escrito. Registrando los valores del formulario se comprobó que la aplicación borraba el primer
campo justo después de que Playwright lo llenaba.

La solución no fue agregar una espera fija, sino hacer que `fillCustomerInfo` confirme que los tres
valores quedaron escritos y, si alguno se perdió, vuelva a llenar el formulario (`expect.toPass`).
Después del cambio, 12 de 12 corridas pasaron en WebKit.

## 6. Diagnóstico de fallos

Cuando un escenario falla se adjunta una captura de pantalla al reporte HTML y se guarda un trace de
Playwright con el DOM, la red y la consola de cada paso. En CI ambos se publican como artefacto.

La variable `TRACE` controla los traces: `retain-on-failure` (por defecto) los conserva solo para los
fallos, `on` los guarda para todos los escenarios y `off` los desactiva. Fue el trace, junto con el
registro de los valores del formulario, lo que permitió diagnosticar el caso de WebKit descrito arriba.
El repositorio incluye los traces de una ejecución completa con `TRACE=on` como evidencia.

## 7. Calidad del código

TypeScript en modo estricto, ESLint con reglas de tipos estrictas y Prettier, verificados también en
el pipeline antes de ejecutar las pruebas.

## 8. Mejoras posibles

- Ejecutar en CI la matriz Chromium, Firefox y WebKit.
- Iniciar sesión por estado guardado (`storageState`) en los escenarios donde el login no es lo que se
  prueba, para acelerar la suite.
- Pruebas de regresión visual y de accesibilidad.
- Publicar el reporte HTML en GitHub Pages.
