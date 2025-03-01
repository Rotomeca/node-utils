//#region MiscFunctions
function isNullOrUndefined(item) {
    return item !== null && item !== undefined;
}
//#endregion

const RotomecaUtils = {};

//#region Define
Object.defineProperties(RotomecaUtils, {
    EMPTY_STRING: {
        get() {
            return require('./lib/constants').EMPTY_STRING;
        }
    },
    Random: {
        get() {
            return require('./lib/random');
        }
    },
    isNullOrUndefined: {
        value: isNullOrUndefined,
        configurable: false,
        enumerable: true,
        writable: false
    }
});
//#endregion

module.export = RotomecaUtils;