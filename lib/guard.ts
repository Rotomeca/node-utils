import { MayBe } from "./types";

/**
 * Vérifie si une valeur inconnue est une chaîne de caractères non vide.
 *
 * Une chaîne composée uniquement d'espaces blancs est considérée comme vide.
 *
 * @param str - La valeur à tester.
 * @returns `true` si `str` est une `string` contenant au moins un caractère non blanc.
 *
 * @example
 * ```ts
 * isNonEmptyString("hello")  // → true
 * isNonEmptyString("   ")    // → false
 * isNonEmptyString(42)       // → false
 * isNonEmptyString(null)     // → false
 * ```
 */
export function isNonEmptyString(str: unknown): str is string {
    return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Vérifie si une valeur est un objet qui se comporte comme un tableau (array-like).
 *
 * Un objet est considéré array-like s'il possède une propriété `length` numérique
 * et que l'index `length - 1` est présent parmi ses propriétés.
 *
 * @typeParam T - Type de la valeur à tester.
 * @param item - La valeur à tester.
 * @returns `true` si `item` possède une structure array-like, `false` sinon.
 *
 * @remarks
 * Cette fonction retourne `false` pour les tableaux vides (`length === 0`),
 * car l'index `length - 1` vaut `-1` et n'est pas présent.
 * Les tableaux natifs (`Array.isArray`) satisfont également ce test.
 *
 * @example
 * ```ts
 * isArrayLike([1, 2, 3])              // → true
 * isArrayLike({ length: 2, 0: 'a', 1: 'b' }) // → true
 * isArrayLike([])                     // → false
 * isArrayLike("hello")                // → false
 * isArrayLike(null)                   // → false
 * ```
 */
export function isArrayLike<T>(item: T): boolean {
    return (
        !!item &&
        typeof item === 'object' &&
        // eslint-disable-next-line no-prototype-builtins
        Object.prototype.hasOwnProperty.call(item, 'length') &&
        typeof (item as any).length === 'number' &&
        (item as any).length - 1 in item
    );
}

/**
 * Vérifie si une valeur inconnue est un tableau contenant au moins un élément.
 *
 * @typeParam T - Type des éléments attendus dans le tableau.
 * @param arr - La valeur à tester.
 * @returns `true` si `arr` est un `Array` non vide, affinant le type en `[T, ...T[]]`.
 *
 * @example
 * ```ts
 * isNonEmptyArray([1, 2, 3]) // → true
 * isNonEmptyArray([])        // → false
 * isNonEmptyArray(null)      // → false
 * isNonEmptyArray("abc")     // → false
 * ```
 */
export function isNonEmptyArray<T>(arr: unknown): arr is [T, ...T[]] {
    return Array.isArray(arr) && arr.length > 0;
}

/**
 * Vérifie si une valeur est un objet plain (non `null`, non tableau, non fonction).
 *
 * @param val - La valeur à tester.
 * @returns `true` si `val` est un objet plain, affinant le type en `Record<string, unknown>`.
 *
 * @example
 * ```ts
 * isObject({ a: 1 })   // → true
 * isObject([1, 2])     // → false
 * isObject(null)       // → false
 * isObject(() => {})   // → false
 * ```
 */
export function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Vérifie si une valeur n'est ni `null` ni `undefined`.
 *
 * Ce type guard affine le type de `item` en `NonNullable<T>` dans le bloc
 * conditionnel, éliminant `null` et `undefined` du type inféré.
 *
 * @typeParam T - Type de base de la valeur testée.
 * @param item - La valeur à tester.
 * @returns `true` si `item` est défini et non nul.
 *
 * @example
 * ```ts
 * isDefined(42)        // → true
 * isDefined("")        // → true
 * isDefined(null)      // → false
 * isDefined(undefined) // → false
 *
 * const value: string | null = getValue();
 * if (isDefined(value)) {
 *   value.toUpperCase(); // TypeScript sait que value est string ici
 * }
 * ```
 */
export function isDefined<T>(item: MayBe<T>): item is NonNullable<T> {
    return item !== null && item !== undefined;
}

/**
 * Vérifie si une valeur est `null` ou `undefined`.
 *
 * Inverse sémantique de {@link isDefined}. Ce type guard affine le type
 * de `item` en `null | undefined` dans le bloc conditionnel.
 *
 * @typeParam T - Type de base de la valeur testée.
 * @param item - La valeur à tester.
 * @returns `true` si `item` est `null` ou `undefined`.
 *
 * @deprecated Préférez {@link isDefined} avec une condition inversée (`!isDefined(x)`),
 * plus idiomatique et cohérent avec les patterns de type guard TypeScript.
 *
 * @example
 * ```ts
 * isNullOrUndefined(null)      // → true
 * isNullOrUndefined(undefined) // → true
 * isNullOrUndefined(0)         // → false
 * isNullOrUndefined("")        // → false
 * ```
 */
export function isNullOrUndefined<T>(item: MayBe<T>): item is null | undefined {
    return !isDefined(item);
}