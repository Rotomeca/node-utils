import { SPACE } from "./lib/constants";
import { MayBe } from "./lib/types";

export * from "./lib/constants";
export * from "./lib/types";
export * from "./lib/random";

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
      item.hasOwnProperty('length') &&
      typeof (item as any).length === 'number' &&
      (item as any).length > 0 &&
      (item as any).length - 1 in item
    );
  }

  /**
   * @deprecated Utilisez {@link capitalize} à la place.
   * @param word Mot à transformer
   * @returns Le mot avec la première lettre en majuscule
   */
export function Capitalize(word: string): string {
  return capitalize(word);
}

/**
 * Met la première lettre d'un mot en majuscule.
 * @param word Mot à transformer
 * @returns Le mot transformé avec une première lettre en majuscule
 */
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * @deprecated Utilisez {@link capitalizeLine} à la place.
 * @param line Texte à transformer
 * @returns Le texte transformé avec chaque mot capitalisé
 */
export function CapitalizeLine(line: string): string {
  return capitalizeLine(line);
}

/**
 * Met la première lettre de chaque mot d'une ligne en majuscule.
 * @param line Ligne de texte à transformer
 * @returns Ligne transformée avec chaque mot capitalisé
 */
export function capitalizeLine(line: string): string {
  return line.split(SPACE)
          .map(capitalize)
          .join(SPACE);
}
//#endregion

