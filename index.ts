import { MayBe } from "./lib/types";
import { Random } from "./lib/random";
export * from "./lib/constants";
export * from "./lib/types";
export * from './lib/StartObject'
export * from './lib/array';
export * from './lib/number';
export * from './lib/pipe';
export * from './lib/object';
export * from './lib/string';

export { Random }

//#region MiscFunctions
/**
 * Vérifie si une valeur est `null` ou `undefined`.
 * @param item Valeur à tester
 * @returns `true` si l'élément est `null` ou `undefined`, sinon `false`
 */
export function isNullOrUndefined<T>(item: MayBe<T>) {
    return item === null || item === undefined;
}

/**
 * Vérifie si une variable est un tableau ou un objet qui se comporte comme un tableau.
 * @param item Valeur à tester
 * @returns `true` si l'élément ressemble à un tableau, sinon `false`
 */
export function isArrayLike<T>(item: T) {
    return (
      !!item &&
      typeof item === 'object' &&
      // eslint-disable-next-line no-prototype-builtins
      Object.prototype.hasOwnProperty.call(item, 'length') &&
      typeof (item as any).length === 'number' &&
      (item as any).length > 0 &&
      (item as any).length - 1 in item
    );
  }
//#endregion MiscFunctions

