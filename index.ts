import { SPACE } from "./lib/constants";
import { MayBe } from "./lib/types";

export * from "./lib/constants";
export * from "./lib/types";
export * from "./lib/random";

//#region MiscFunctions
export function isNullOrUndefined<T>(item: MayBe<T>) {
    return item !== null || item !== undefined;
}

/**
 * Vérifie si une varible est un tableau ou quelque chose qui y ressemble
 * @param item
 */
export function isArrayLike<T>(item: T) {
    return (
      !!item &&
      typeof item === 'object' &&
      // eslint-disable-next-line no-prototype-builtins
      item.hasOwnProperty('length') &&
      typeof (item as any).length === 'number' &&
      (item as any).length > 0 &&
      (item as any).length - 1 in item
    );
  }

  /**
   * @deprecated Utilisez {@link capitalize} plutôt
   * @param word 
   * @returns 
   */
export function Capitalize(word: string): string {
  return capitalize(word);
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * @deprecated Utilisez {@link capitalizeLine} plutôt
 * @param line 
 * @returns 
 */
export function CapitalizeLine(line: string): string {
  return capitalizeLine(line);
}

export function capitalizeLine(line: string): string {
  return line.split(SPACE)
          .map(capitalize)
          .join(SPACE);
}
//#endregion

