import Random from './lib/random';
declare module "@rotomeca/utils";
declare namespace RotomecaUtils {
    const EMPTY_STRING: string;
    const Random: Random;
    function isNullOrUndefined(item: any): boolean;
}

export = RotomecaUtils;