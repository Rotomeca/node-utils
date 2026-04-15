export type int = number & { readonly __brand: 'int' };
export type uint = number & { readonly __brand: 'uint' };
export type float = number & { readonly __brand: 'float' };
export type ufloat = number & { readonly __brand: 'ufloat' };
export type Selector<T extends string = string> = T extends `${string}${'#' | '.'}${string}`
  ? T
  : never;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MayBe<T> = Optional<Nullable<T>>;

export function toInt(n: number): int {
  if (!Number.isInteger(n)) throw new Error(`${n} is not an integer`);
  return n as int;
}

export function toUint(n: number): uint {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${n} is not a positive integer`);
  return n as uint;
}

export function toFloat(n: number): float {
  if (!isFinite(n)) throw new Error(`${n} is not a float`);
  return n as float;
}

export function toUfloat(n: number): ufloat {
  if (!isFinite(n) || n < 0) throw new Error(`${n} is not a positive float`);
  return n as ufloat;
}