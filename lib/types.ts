/**
 * Représente un entier signé.
 */
export type int = number & { readonly __brand: 'int' };

/**
 * Représente un entier non signé.
 */
export type uint = number & { readonly __brand: 'uint' };

/**
 * Représente un nombre à virgule flottante.
 */
export type float = number & { readonly __brand: 'float' };

/**
 * Représente un nombre à virgule flottante non signé.
 */
export type ufloat = number & { readonly __brand: 'ufloat' };

/**
 * Représente un sélecteur CSS valide contenant `#` ou `.`.
 */
export type Selector<T extends string = string> = T extends `${string}${'#' | '.'}${string}`
  ? T
  : never;
/**
 * Représente une valeur qui peut être `null`.
 */
export type Nullable<T> = T | null;

/**
 * Représente une valeur qui peut être `undefined`.
 */
export type Optional<T> = T | undefined;

/**
 * Représente une valeur qui peut être `undefined` ou `null`.
 */
export type MayBe<T> = Optional<Nullable<T>>;

/**
 * Convertit un nombre en entier typé.
 * @param n Nombre à convertir
 * @returns La valeur convertie en `int`
 * @throws Erreur si la valeur n'est pas un entier
 */
export function toInt(n: number): int {
  if (!Number.isInteger(n)) throw new Error(`${n} is not an integer`);
  return n as int;
}

/**
 * Convertit un nombre en entier non signé typé.
 * @param n Nombre à convertir
 * @returns La valeur convertie en `uint`
 * @throws Erreur si la valeur n'est pas un entier positif
 */
export function toUint(n: number): uint {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${n} is not a positive integer`);
  return n as uint;
}

/**
 * Convertit un nombre en nombre flottant typé.
 * @param n Nombre à convertir
 * @returns La valeur convertie en `float`
 * @throws Erreur si la valeur n'est pas un nombre fini
 */
export function toFloat(n: number): float {
  if (!isFinite(n)) throw new Error(`${n} is not a float`);
  return n as float;
}

/**
 * Convertit un nombre en nombre flottant non signé typé.
 * @param n Nombre à convertir
 * @returns La valeur convertie en `ufloat`
 * @throws Erreur si la valeur n'est pas un nombre fini positif
 */
export function toUfloat(n: number): ufloat {
  if (!isFinite(n) || n < 0) throw new Error(`${n} is not a positive float`);
  return n as ufloat;
}