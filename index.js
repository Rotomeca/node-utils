const { EMPTY_STRING } = require("./lib/constants");
const Random = require("./lib/random");

//#region MiscFunctions
function isNullOrUndefined(item) {
    return item !== null || item !== undefined;
}

/**
 * Vérifie si une varible est un tableau ou quelque chose qui y ressemble
 * @param {*} item
 * @returns {bool}
 */
function isArrayLike(item) {
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


module.exports = {EMPTY_STRING, Random, isNullOrUndefined, isArrayLike};