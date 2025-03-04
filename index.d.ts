import { EMPTY_STRING } from './lib/constants';
import Random from './lib/random';
export = {isNullOrUndefined, Random, EMPTY_STRING, isArrayLike};
declare module "@rotomeca/utils";
function isNullOrUndefined(item: any): boolean;
/**
 * Vérifie si une variable est un tableau ou quelque chose qui y ressemble
 * @param {any} item Element à vérifier
 * @returns {bool} true si l'élément est un tableau ou quelque chose qui y ressemble
 */
function isArrayLike(item: any): boolean;

