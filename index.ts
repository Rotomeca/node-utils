import { SPACE } from "./lib/constants";
import { MayBe } from "./lib/types";
import { Random } from "./lib/random";
export * from "./lib/constants";
export * from "./lib/types";
export * from './lib/StartObject'
export * from './lib/array';

export { Random }

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
      Object.prototype.hasOwnProperty.call(item, 'length') &&
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

//#region Pipe
/**
 * Exécute une fonction sur une valeur et retourne le résultat.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @returns Résultat de la première fonction.
 */
export function pipe<A, B>(value: A, fn1: (arg: A) => B): B;

/**
 * Enchaîne deux fonctions en appliquant la seconde au résultat de la première.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la seconde fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @returns Résultat de la deuxième fonction.
 */
export function pipe<A, B, C>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C): C;

/**
 * Enchaîne trois fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @returns Résultat de la troisième fonction.
 */
export function pipe<A, B, C, D>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D): D;

/**
 * Enchaîne quatre fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @returns Résultat de la quatrième fonction.
 */
export function pipe<A, B, C, D, E>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E): E;

/**
 * Enchaîne cinq fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @typeParam F Type du résultat de la cinquième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @param fn5 Cinquième fonction appliquée au résultat de fn4.
 * @returns Résultat de la cinquième fonction.
 */
export function pipe<A, B, C, D, E, F>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F): F;

/**
 * Enchaîne six fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @typeParam F Type du résultat de la cinquième fonction.
 * @typeParam G Type du résultat de la sixième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @param fn5 Cinquième fonction appliquée au résultat de fn4.
 * @param fn6 Sixième fonction appliquée au résultat de fn5.
 * @returns Résultat de la sixième fonction.
 */
export function pipe<A, B, C, D, E, F, G>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G): G;

/**
 * Enchaîne sept fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @typeParam F Type du résultat de la cinquième fonction.
 * @typeParam G Type du résultat de la sixième fonction.
 * @typeParam H Type du résultat de la septième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @param fn5 Cinquième fonction appliquée au résultat de fn4.
 * @param fn6 Sixième fonction appliquée au résultat de fn5.
 * @param fn7 Septième fonction appliquée au résultat de fn6.
 * @returns Résultat de la septième fonction.
 */
export function pipe<A, B, C, D, E, F, G, H>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H): H;

/**
 * Enchaîne huit fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @typeParam F Type du résultat de la cinquième fonction.
 * @typeParam G Type du résultat de la sixième fonction.
 * @typeParam H Type du résultat de la septième fonction.
 * @typeParam I Type du résultat de la huitième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @param fn5 Cinquième fonction appliquée au résultat de fn4.
 * @param fn6 Sixième fonction appliquée au résultat de fn5.
 * @param fn7 Septième fonction appliquée au résultat de fn6.
 * @param fn8 Huitième fonction appliquée au résultat de fn7.
 * @returns Résultat de la huitième fonction.
 */
export function pipe<A, B, C, D, E, F, G, H, I>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H, fn8: (arg: H) => I): I;

/**
 * Enchaîne neuf fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @typeParam F Type du résultat de la cinquième fonction.
 * @typeParam G Type du résultat de la sixième fonction.
 * @typeParam H Type du résultat de la septième fonction.
 * @typeParam I Type du résultat de la huitième fonction.
 * @typeParam J Type du résultat de la neuvième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @param fn5 Cinquième fonction appliquée au résultat de fn4.
 * @param fn6 Sixième fonction appliquée au résultat de fn5.
 * @param fn7 Septième fonction appliquée au résultat de fn6.
 * @param fn8 Huitième fonction appliquée au résultat de fn7.
 * @param fn9 Neuvième fonction appliquée au résultat de fn8.
 * @returns Résultat de la neuvième fonction.
 */
export function pipe<A, B, C, D, E, F, G, H, I, J>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H, fn8: (arg: H) => I, fn9: (arg: I) => J): J;

/**
 * Enchaîne dix fonctions en appliquant chaque fonction au résultat de la précédente.
 * @typeParam A Type de la valeur d'entrée.
 * @typeParam B Type du résultat de la première fonction.
 * @typeParam C Type du résultat de la deuxième fonction.
 * @typeParam D Type du résultat de la troisième fonction.
 * @typeParam E Type du résultat de la quatrième fonction.
 * @typeParam F Type du résultat de la cinquième fonction.
 * @typeParam G Type du résultat de la sixième fonction.
 * @typeParam H Type du résultat de la septième fonction.
 * @typeParam I Type du résultat de la huitième fonction.
 * @typeParam J Type du résultat de la neuvième fonction.
 * @typeParam K Type du résultat de la dixième fonction.
 * @param value Valeur initiale.
 * @param fn1 Première fonction à exécuter.
 * @param fn2 Seconde fonction appliquée au résultat de fn1.
 * @param fn3 Troisième fonction appliquée au résultat de fn2.
 * @param fn4 Quatrième fonction appliquée au résultat de fn3.
 * @param fn5 Cinquième fonction appliquée au résultat de fn4.
 * @param fn6 Sixième fonction appliquée au résultat de fn5.
 * @param fn7 Septième fonction appliquée au résultat de fn6.
 * @param fn8 Huitième fonction appliquée au résultat de fn7.
 * @param fn9 Neuvième fonction appliquée au résultat de fn8.
 * @param fn10 Dixième fonction appliquée au résultat de fn9.
 * @returns Résultat de la dixième fonction.
 */
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(value: A, fn1: (arg: A) => B, fn2: (arg: B) => C, fn3: (arg: C) => D, fn4: (arg: D) => E, fn5: (arg: E) => F, fn6: (arg: F) => G, fn7: (arg: G) => H, fn8: (arg: H) => I, fn9: (arg: I) => J, fn10: (arg: J) => K): K;
export function pipe(value: any, ...fns: Array<(arg: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}
//#endregion Pipe
//#endregion MiscFunctions

