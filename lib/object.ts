import { isDefined, isObject, isPlainObject } from "./guard";
import { pipe } from "./pipe";

/**
 * Extrait un sous-ensemble de propriétés d'un objet.
 *
 * @param obj - L'objet source
 * @param keys - Les clés à conserver
 * @returns Un nouvel objet ne contenant que les propriétés listées dans `keys`
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // → { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  if (!obj || keys.length === 0) return {} as Pick<T, K>;

  const result: Pick<T, K> = {} as Pick<T, K>;
  for (let i = 0, len = keys.length; i < len; ++i) {
    const key = keys[i];
    result[key] = obj[key];
  }

  return result;
}

/**
 * Retourne un nouvel objet sans les propriétés listées.
 *
 * @param obj - L'objet source
 * @param keys - Les clés à exclure
 * @returns Un nouvel objet sans les propriétés listées dans `keys`
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b'])  // → { a: 1, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  if (!obj) return {} as Omit<T, K>;
  if (keys.length === 0) return { ...obj } as Omit<T, K>;

  const keysSet = new Set(keys);
  const result = {} as Omit<T, K>;
  const objKeys = Object.keys(obj) as (keyof T)[];

  for (let i = 0, len = objKeys.length; i < len; ++i) {
    const key = objKeys[i];
    if (!keysSet.has(key as K)) {
      (result as T)[key] = obj[key];
    }
  }

  return result;
}

/**
 * Clone un objet en profondeur — aucune référence partagée avec l'original.
 *
 * Utilise `structuredClone` si disponible, sinon effectue un fallback via
 * `JSON.stringify` / `JSON.parse` avec perte possible de certains types
 * (`undefined`, `Date`, `Map`, `Set`, fonctions…).
 *
 * @param obj - L'objet à cloner
 * @param logger - Logger en cas du fallback.
 * @returns Un clone profond de `obj`
 *
 * @example
 * const clone = deepClone({ a: { b: 1 } })
 * clone.a.b = 99  // l'original n'est pas affecté
 */
export function deepClone<T>(
  obj: T,
  logger: (msg: string) => void = console.warn,
): T {
  if (typeof structuredClone !== "undefined") return structuredClone(obj);
  logger(
    "deepClone: structuredClone indisponible, fallback JSON (pertes possibles)",
  );
  return pipe(obj, JSON.stringify, JSON.parse) as unknown as T;
}

/**
 * Vérifie si un objet ne possède aucune propriété propre.
 *
 * @param obj - L'objet à tester
 * @returns `true` si l'objet est vide, `false` sinon
 *
 * @example
 * isEmpty({})        // → true
 * isEmpty({ a: 1 }) // → false
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Transforme les valeurs d'un objet en appliquant `fn` à chacune.
 *
 * @param obj - L'objet source
 * @param fn - La fonction de transformation appliquée à chaque valeur
 * @returns Un nouvel objet avec les mêmes clés et les valeurs transformées
 *
 * @example
 * mapValues({ a: 1, b: 2 }, x => x * 2)  // → { a: 2, b: 4 }
 */
export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U,
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;
  const keys = Object.keys(obj) as (keyof T)[];

  for (let i = 0, len = keys.length; i < len; ++i) {
    const key = keys[i];
    result[key] = fn(obj[key], key);
  }

  return result;
}

/**
 * Transforme les clés d'un objet en appliquant `fn` à chacune.
 *
 * @param obj - L'objet source
 * @param fn - La fonction de transformation appliquée à chaque clé
 * @returns Un nouvel objet avec les mêmes valeurs et les clés transformées
 *
 * @example
 * mapKeys({ a: 1, b: 2 }, k => k.toUpperCase())  // → { A: 1, B: 2 }
 */
export function mapKeys<T extends object>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => string,
): Record<string, T[keyof T]> {
  const result = {} as Record<string, T[keyof T]>;
  const keys = Object.keys(obj) as (keyof T)[];

  for (let i = 0, len = keys.length; i < len; ++i) {
    const key = keys[i];
    result[fn(key, obj[key])] = obj[key];
  }

  return result;
}

/**
 * Fusionne `source` dans `target` de façon récursive et retourne un nouvel objet.
 *
 * Les objets plains imbriqués sont fusionnés récursivement. Les tableaux,
 * les valeurs primitives et les instances de classes (`Date`, `Map`, etc.)
 * de `source` écrasent ceux de `target`. Les propriétés présentes dans
 * `target` mais absentes de `source` sont conservées.
 * Les deux objets d'origine ne sont pas mutés.
 *
 * Les clés sensibles (`__proto__`, `constructor`, `prototype`) sont ignorées
 * pour prévenir toute pollution de prototype.
 *
 * @typeParam T - Type de l'objet cible.
 * @typeParam U - Type de l'objet source.
 * @param target - L'objet de base.
 * @param source - L'objet dont les propriétés sont fusionnées dans `target`.
 * @returns Un nouvel objet de type `T & U` résultant de la fusion récursive.
 *
 * @example
 * ```ts
 * deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 99 } })
 * // → { a: 1, b: { c: 99, d: 3 } }
 *
 * deepMerge({ a: [1, 2] }, { a: [3, 4, 5] })
 * // → { a: [3, 4, 5] }  (tableau écrasé, pas fusionné)
 *
 * deepMerge({ d: new Date('2020') }, { d: new Date('2024') })
 * // → { d: Date(2024) }  (instance écrasée, pas fusionnée)
 * ```
 */
export function deepMerge<T extends object, U extends object>(
  target: T,
  source: U,
): T & U {
  const result = { ...target } as Record<string, unknown>;

  for (let i = 0, keys = Object.keys(source), len = keys.length; i < len; ++i) {
    const key = keys[i];
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }

    const targetValue = result[key];
    const sourceValue = (source as Record<string, unknown>)[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue))
      result[key] = deepMerge(targetValue, sourceValue);
    else result[key] = sourceValue;
  }

  return result as T & U;
}

/**
 * Aplatit un objet imbriqué en un objet à un seul niveau,
 * en joignant les clés avec `separator`.
 *
 * Seuls les objets plains sont récursés (voir {@link isPlainObject}) —
 * les tableaux, `Date`, `Map`, instances de classes, etc. sont conservés
 * tels quels comme valeurs feuilles.
 *
 * @param obj - L'objet source à aplatir.
 * @param separator - Le séparateur entre les clés (défaut : `"."`).
 * @returns Un objet à un seul niveau de profondeur.
 *
 * @example
 * ```ts
 * flattenObject({ a: { b: 1, c: { d: 2 } } })
 * // → { 'a.b': 1, 'a.c.d': 2 }
 *
 * flattenObject({ a: { b: 1 } }, '/')
 * // → { 'a/b': 1 }
 *
 * flattenObject({ a: [1, 2], b: { c: 3 } })
 * // → { 'a': [1, 2], 'b.c': 3 }  (tableau conservé)
 * ```
 */
export function flattenObject(
  obj: object,
  separator = ".",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  function _flatten(current: Record<string, unknown>, prefix: string): void {
    const keys = Object.keys(current);
    for (let i = 0, len = keys.length; i < len; ++i) {
      const key = keys[i];
      const value = current[key];
      const newKey = prefix ? `${prefix}${separator}${key}` : key;

      if (isPlainObject(value)) _flatten(value, newKey);
      else result[newKey] = value;
    }
  }

  _flatten(obj as Record<string, unknown>, "");
  return result;
}

/**
 * Reconstruit un objet imbriqué à partir d'un objet aplati,
 * en découpant les clés sur `separator`.
 *
 * Inverse de {@link flattenObject}. Si une clé intermédiaire est déjà
 * occupée par une valeur primitive, elle est silencieusement remplacée
 * par un objet pour accueillir les clés enfants.
 *
 * @param obj - L'objet aplati source.
 * @param separator - Le séparateur utilisé pour découper les clés (défaut : `"."`).
 * @returns Un objet potentiellement imbriqué.
 *
 * @example
 * ```ts
 * unflattenObject({ 'a.b': 1, 'a.c.d': 2 })
 * // → { a: { b: 1, c: { d: 2 } } }
 *
 * unflattenObject({ 'a/b': 1 }, '/')
 * // → { a: { b: 1 } }
 * ```
 *
 * @see {@link flattenObject} pour l'opération inverse.
 */
export function unflattenObject(
  obj: Record<string, unknown>,
  separator = ".",
): object {
  const result: Record<string, unknown> = {};

  const keys = Object.keys(obj);
  for (let i = 0, len = keys.length; i < len; ++i) {
    const key = keys[i];
    const parts = key.split(separator);
    let current = result;

    for (let j = 0; j < parts.length - 1; ++j) {
      const part = parts[j];
      if (!isPlainObject(current[part])) current[part] = {};
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = obj[key];
  }

  return result;
}

/**
 * Retourne un nouvel objet ne contenant que les clés pour lesquelles
 * `predicate` retourne `true`.
 *
 * Similaire à {@link omit} et {@link pick}, mais avec un prédicat dynamique
 * au lieu d'une liste de clés fixe. L'objet d'origine n'est pas muté.
 *
 * @typeParam T - Type de l'objet source.
 * @param obj - L'objet source à filtrer.
 * @param predicate - Fonction de test appliquée à chaque clé.
 * @returns Un objet partiel ne contenant que les clés satisfaisant `predicate`.
 *
 * @example
 * ```ts
 * filterKeys({ a: 1, b: 2, c: 3 }, key => key !== 'b')
 * // → { a: 1, c: 3 }
 *
 * filterKeys({ name: 'Alice', age: 30, _id: 1 }, key => !String(key).startsWith('_'))
 * // → { name: 'Alice', age: 30 }
 * ```
 */
export function filterKeys<T extends object>(
  obj: T,
  predicate: (key: keyof T) => boolean,
): Partial<T> {
  const result: Partial<T> = {};
  for (
    let i = 0,
      keys: (keyof T)[] = Object.keys(obj) as (keyof T)[],
      len = keys.length;
    i < len;
    ++i
  ) {
    const key: keyof T = keys[i];

    if (predicate(key)) result[key] = obj[key];
  }

  return result;
}

/**
 * Retourne un nouvel objet ne contenant que les entrées dont la valeur
 * satisfait `predicate`.
 *
 * Similaire à {@link filterKeys}, mais le prédicat porte sur les valeurs
 * plutôt que sur les clés. L'objet d'origine n'est pas muté.
 *
 * @typeParam T - Type de l'objet source.
 * @param obj - L'objet source à filtrer.
 * @param predicate - Fonction de test appliquée à chaque valeur.
 * @returns Un objet partiel ne contenant que les entrées dont la valeur satisfait `predicate`.
 *
 * @example
 * ```ts
 * filterValues({ a: 1, b: 0, c: 3 }, value => value > 0)
 * // → { a: 1, c: 3 }
 *
 * filterValues({ x: 'hello', y: null, z: 'world' }, isDefined)
 * // → { x: 'hello', z: 'world' }
 * ```
 */
export function filterValues<T extends object>(
  obj: T,
  predicate: (value: T[keyof T]) => boolean,
): Partial<T> {
  const result: Partial<T> = {};
  for (
    let i = 0,
      keys: (keyof T)[] = Object.keys(obj) as (keyof T)[],
      len = keys.length;
    i < len;
    ++i
  ) {
    const key: keyof T = keys[i];
    const value = obj[key];

    if (predicate(value)) result[key] = value;
  }

  return result;
}

/**
 * Retourne un nouvel objet avec les clés et valeurs inversées.
 *
 * Passe unique sur les clés propres énumérables de `obj`.
 * Si deux clés partagent la même valeur, la dernière rencontrée
 * l'emporte dans le résultat — le comportement n'est garanti
 * correct que si les valeurs sont uniques.
 * L'objet d'origine n'est pas muté.
 *
 * @typeParam K - Type des clés de l'objet source (contraint à `string`).
 * @typeParam V - Type des valeurs de l'objet source (contraint à `string`).
 * @param obj - L'objet source dont les clés et valeurs sont inversées.
 * @returns Un nouvel objet `Record<V, K>` avec clés et valeurs permutées.
 *
 * @example
 * ```ts
 * invert({ a: 'x', b: 'y', c: 'z' }) // → { x: 'a', y: 'b', z: 'c' }
 * invert({ fr: 'Bonjour', en: 'Hello' }) // → { Bonjour: 'fr', Hello: 'en' }
 * ```
 */
export function invert<K extends string, V extends string>(
  obj: Record<K, V>,
): Record<V, K> {
  const keys = Object.keys(obj) as K[];
  const result = {} as Record<V, K>;

  for (let i = 0, len = keys.length; i < len; ++i) {
    const key = keys[i];
    result[obj[key]] = key;
  }

  return result;
}
