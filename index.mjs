import { EMPTY_STRING } from "./lib/constants";
import Random from "./lib/random";

//#region MiscFunctions
export function isNullOrUndefined(item) {
    return item !== null || item !== undefined;
}

/**
 * Vérifie si une varible est un tableau ou quelque chose qui y ressemble
 * @param {*} item
 * @returns {bool}
 */
export function isArrayLike(item) {
    return (
      !!item &&
      typeof item === 'object' &&
      // eslint-disable-next-line no-prototype-builtins
      item.hasOwnProperty('length') &&
      typeof item.length === 'number' &&
      item.length > 0 &&
      item.length - 1 in item
    );
  }
//#endregion

export {EMPTY_STRING, Random};