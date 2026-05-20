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
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
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
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
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
export function deepClone<T>(obj: T, logger: (msg: string) => void = console.warn): T {
    if (typeof structuredClone !== "undefined") return structuredClone(obj);
    logger("deepClone: structuredClone indisponible, fallback JSON (pertes possibles)");
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
    fn: (value: T[keyof T], key: keyof T) => U
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
    fn: (key: keyof T, value: T[keyof T]) => string
): Record<string, T[keyof T]> {
    const result = {} as Record<string, T[keyof T]>;
    const keys = Object.keys(obj) as (keyof T)[];

    for (let i = 0, len = keys.length; i < len; ++i) {
        const key = keys[i];
        result[fn(key, obj[key])] = obj[key];
    }

    return result;
}