const { EMPTY_STRING } = require("./lib/constants");
const Random = require("./lib/random");

//#region MiscFunctions
function isNullOrUndefined(item) {
    return item !== null || item !== undefined;
}
//#endregion


module.exports = {EMPTY_STRING, Random, isNullOrUndefined};