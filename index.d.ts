import { EMPTY_STRING } from './lib/constants';
import Random from './lib/random';
declare module "@rotomeca/utils";
export declare function isNullOrUndefined(item: any): boolean;
/**
 * Vérifie si une variable est un tableau ou quelque chose qui y ressemble
 * @param {any} item Element à vérifier
 * @returns {bool} true si l'élément est un tableau ou quelque chose qui y ressemble
 */
export declare function isArrayLike(item: any): boolean;
export { Random, EMPTY_STRING };

