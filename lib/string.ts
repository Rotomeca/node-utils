import { SPACE } from "./constants";

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