/**
 * Extrae el primer importe en dólares de un texto ("$29.99", "Item total: $39.98")
 * y lo devuelve en centavos, para comparar sin errores de punto flotante.
 */
export function parseCents(text: string): number {
  const match = /\$(\d+(?:\.\d{1,2})?)/.exec(text);
  if (!match) {
    throw new Error(`No se encontró un importe en el texto "${text}".`);
  }
  return Math.round(Number(match[1]) * 100);
}
