// Los tipos se validan con `npm run typecheck`; durante la ejecución solo se transpila.
process.env.TS_NODE_TRANSPILE_ONLY ??= 'true';

const isCI = Boolean(process.env.CI);

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    // Sin `paths`: Cucumber usa `features/` por defecto y así una ruta pasada por consola
    // reemplaza al conjunto completo en lugar de sumarse a él.
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    format: [
      isCI ? 'progress' : 'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    retry: isCI ? 1 : 0,
  },
};
