import { isDefined } from "./guard";
import { MayBe, Nullable, uint } from "./types";

/**
 * Découpe un tableau en sous-tableaux de taille donnée.
 *
 * Si le tableau est vide ou si `size` est inférieur ou égal à 0, la
 * fonction renvoie un tableau vide.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Tableau source à découper.
 * @param size - Taille maximale de chaque sous-tableau (entier non signé).
 * @returns Un tableau de sous-tableaux de type `T[][]`.
 * @example
 * ```ts
 * chunk([1,2,3,4,5], 2) // -> [[1,2],[3,4],[5]]
 * ```
 */
export function chunk<T>(arr: T[], size: uint): T[][] {
  const length = arr.length;

  if (length === 0 || size <= 0) {
    return [];
  }

  const chunkCount = Math.ceil(length / size);
  const result = new Array<T[]>(chunkCount);

  let resultIndex = 0;
  let arrIndex = 0;

  while (arrIndex < length) {
    const currentChunkSize = Math.min(size, length - arrIndex);
    const subArray = new Array<T>(currentChunkSize);

    for (let i = 0; i < currentChunkSize; i++) {
      subArray[i] = arr[arrIndex + i];
    }

    result[resultIndex++] = subArray;
    arrIndex += size;
  }

  return result;
}

/**
 * Renvoie un tableau contenant les éléments uniques (ordre préservé).
 *
 * @typeParam T - Type des éléments.
 * @param arr - Tableau source.
 * @returns Un nouveau tableau contenant chaque valeur unique une seule fois.
 * @example
 * ```ts
 * unique([1,2,2,3]) // -> [1,2,3]
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Renvoie les éléments uniques d'un tableau selon une fonction de projection.
 *
 * La fonction `fn` est appliquée à chaque élément pour obtenir une clé de
 * comparaison. Le premier élément rencontré pour chaque clé est conservé.
 *
 * @typeParam T - Type des éléments.
 * @param arr - Tableau source.
 * @param fn - Fonction qui retourne la clé utilisée pour détecter l'unicité.
 * @returns Un tableau filtré avec des éléments uniques selon `fn`.
 * @example
 * ```ts
 * uniqueBy([{id:1},{id:1}], x => x.id) // -> [{id:1}]
 * ```
 */
export function uniqueBy<T>(arr: T[], fn: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];
  const length = arr.length;

  for (let i = 0; i < length; i++) {
    const item = arr[i];
    const key = fn(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

/**
 * Regroupe les éléments d'un tableau par clé retournée par la fonction `fn`.
 *
 * Chaque clé pointe vers un tableau des éléments correspondants. Si aucune
 * valeur n'existe pour une clé, la clé n'est pas présente dans l'objet
 * retourné.
 *
 * @typeParam T - Type des éléments.
 * @param arr - Tableau source.
 * @param fn - Fonction qui retourne la clé de regroupement.
 * @returns Un objet dont les propriétés sont les clés et les valeurs des tableaux d'éléments.
 * @example
 * ```ts
 * groupBy(['a','ab','b'], s => s[0]) // -> { a: ['a','ab'], b: ['b'] }
 * ```
 */
export function groupBy<T>(
  arr: T[],
  fn: (item: T) => string,
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (let i = 0, len = arr.length; i < len; ++i) {
    const element = arr[i];
    const key = fn(element);

    if (!result[key]) result[key] = [];

    result[key].push(element);
  }

  return result;
}

/**
 * Renvoie le premier élément du tableau ou `null` si vide.
 *
 * @typeParam T - Type des éléments.
 * @param arr - Tableau source.
 * @returns Le premier élément ou `null`.
 */
export function first<T>(arr: T[]): MayBe<T> {
  if (arr.length === 0) return null;

  return arr[0];
}

/**
 * Renvoie le dernier élément du tableau ou `null` si vide.
 *
 * @typeParam T - Type des éléments.
 * @param arr - Tableau source.
 * @returns Le dernier élément ou `null`.
 */
export function last<T>(arr: T[]): MayBe<T> {
  const len = arr.length;
  if (len === 0) return null;

  return arr[len - 1];
}

/**
 * Somme des nombres d'un tableau.
 *
 * @param arr - Tableau de nombres.
 * @returns La somme (0 si le tableau est vide).
 */
export function sum(arr: number[]): number {
  if (arr.length === 0) return 0;

  let total = 0;
  for (let i = 0, len = arr.length; i < len; ++i) {
    total += arr[i];
  }

  return total;
}

/**
 * Trie un tableau d'éléments en se basant sur une clé de comparaison extraite pour chaque élément.
 *
 * Cette fonction est pure (elle ne mute pas le tableau d'origine). Pour garantir des performances
 * optimales sur de grands jeux de données, elle implémente la Transformée de Schwartz
 * (Decorate-Sort-Undecorate). Ainsi, la fonction d'extraction `fn` n'est exécutée qu'une
 * seule fois par élément, évitant les goulets d'étranglement lors de calculs lourds.
 * Les chaînes de caractères sont triées nativement en tenant compte des spécificités locales (accents).
 *
 * @template T - Le type des éléments contenus dans le tableau.
 * @param arr - Le tableau source à trier.
 * @param fn - La fonction appelée pour chaque élément afin d'en extraire la valeur de tri (doit retourner un `number` ou une `string`).
 * @returns Un nouveau tableau contenant les éléments triés.
 *
 * @example
 * const users = [
 *   { id: 3, name: 'Zoe' },
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Éric' }
 * ];
 *
 * // Tri numérique
 * const byId = sortBy(users, user => user.id);
 * // => [{id: 1, name: 'Alice'}, {id: 2, name: 'Éric'}, {id: 3, name: 'Zoe'}]
 *
 * // Tri alphabétique (gère correctement les accents via localeCompare)
 * const byName = sortBy(users, user => user.name);
 * // => [{id: 1, name: 'Alice'}, {id: 2, name: 'Éric'}, {id: 3, name: 'Zoe'}]
 */
export function sortBy<T>(arr: T[], fn: (item: T) => number | string): T[] {
  const len = arr.length;

  const mapped = new Array<{ item: T; key: number | string }>(len);

  for (let i = 0; i < len; ++i) {
    mapped[i] = { item: arr[i], key: fn(arr[i]) };
  }

  mapped.sort((a, b) => {
    if (typeof a.key === "number" && typeof b.key === "number") {
      return a.key - b.key;
    }
    return String(a.key).localeCompare(String(b.key));
  });

  const result = new Array<T>(len);
  for (let i = 0; i < len; ++i) {
    result[i] = mapped[i].item;
  }

  return result;
}

/**
 * Aplatit un tableau de tableaux en un tableau à un seul niveau de profondeur.
 *
 * Utilise `Array.flat()` nativement si disponible (Node 11+, navigateurs modernes),
 * avec un fallback manuel sans limite de call stack pour les environnements anciens.
 *
 * @typeParam T - Type des éléments contenus dans les sous-tableaux.
 * @param arr - Le tableau de tableaux à aplatir.
 * @returns Un nouveau tableau contenant tous les éléments des sous-tableaux, dans l'ordre.
 *
 * @remarks
 * Ne traite qu'un seul niveau de profondeur — les sous-tableaux imbriqués
 * au-delà du premier niveau sont conservés tels quels.
 *
 * Le fallback évite intentionnellement `concat(...arr)` qui peut lever un
 * `RangeError: Maximum call stack size exceeded` sur de grands volumes de sous-tableaux.
 *
 * @example
 * ```ts
 * flatten([[1, 2], [3, 4], [5]]) // → [1, 2, 3, 4, 5]
 * flatten([[1, [2, 3]], [4]])     // → [1, [2, 3], 4]  (un seul niveau)
 * flatten([])                    // → []
 * ```
 */
export function flatten<T>(arr: T[][]): T[] {
  if (typeof arr.flat === "function") return arr.flat() as T[];

  const result: T[] = [];
  for (let i = 0, len = arr.length; i < len; ++i) {
    const sub = arr[i];
    for (let j = 0, subLen = sub.length; j < subLen; ++j) {
      result.push(sub[j]);
    }
  }

  return result;
}

/**
 * Aplatit récursivement un tableau imbriqué sur tous les niveaux de profondeur.
 *
 * Utilise `Array.flat(Infinity)` nativement si disponible (Node 11+, navigateurs modernes),
 * avec un fallback récursif pour les environnements anciens.
 *
 * @typeParam T - Type des éléments feuilles attendus après aplatissement complet.
 * @param arr - Le tableau potentiellement imbriqué à aplatir.
 * @returns Un nouveau tableau plat contenant tous les éléments feuilles, dans l'ordre.
 *
 * @remarks
 * Le paramètre `arr` est typé `unknown[]` car la profondeur d'imbrication est arbitraire —
 * `T[][]` ou `T[][][]` ne permettraient pas de représenter une profondeur variable.
 * Le consommateur est responsable de fournir le type `T` correspondant aux éléments feuilles.
 *
 * Le fallback récursif peut atteindre les limites de call stack sur des structures
 * extrêmement profondes (plusieurs milliers de niveaux d'imbrication). Ce cas est
 * considéré hors scope pour un usage standard.
 *
 * Pour un aplatissement à un seul niveau, préférer {@link flatten}.
 *
 * @example
 * ```ts
 * flattenDeep<number>([1, [2, [3, [4]]]])   // → [1, 2, 3, 4]
 * flattenDeep<number>([1, [2], [[3], [4]]]) // → [1, 2, 3, 4]
 * flattenDeep<number>([])                   // → []
 * ```
 *
 * @see {@link flatten} pour un aplatissement à un seul niveau.
 */
export function flattenDeep<T>(arr: unknown[]): T[] {
  if (typeof (arr as any).flat === "function")
    return (arr as any).flat(Infinity) as T[];

  const result: T[] = [];

  for (let i = 0, len = arr.length; i < len; ++i) {
    const item = arr[i];
    if (Array.isArray(item)) {
      const nested = flattenDeep<T>(item);
      for (let j = 0, nestedLen = nested.length; j < nestedLen; ++j) {
        result.push(nested[j]);
      }
    } else {
      result.push(item as T);
    }
  }

  return result;
}

/**
 * Supprime les valeurs falsy d'un tableau (`null`, `undefined`, `false`, `0`, `""`).
 *
 * @typeParam T - Type des éléments conservés après filtrage.
 * @param arr - Le tableau source pouvant contenir des valeurs falsy.
 * @returns Un nouveau tableau ne contenant que les valeurs truthy, typé `T[]`.
 *
 * @remarks
 * Les valeurs `0`, `false` et `""` sont supprimées même si `T` les inclut.
 * Si ces valeurs sont significatives dans votre contexte, préférer un filtre
 * explicite avec `arr.filter(x => x !== null && x !== undefined)`.
 *
 * @example
 * ```ts
 * compact([1, null, 2, undefined, 3])       // → [1, 2, 3]
 * compact(["a", "", "b", null])             // → ["a", "b"]
 * compact<number | null>([0, 1, null, 2])   // → [1, 2]  (0 supprimé)
 * ```
 */
export function compact<T>(
  arr: Array<T | null | undefined | false | 0 | "">,
): T[] {
  return arr.filter((x): x is T => !!x) as T[];
}

/**
 * Divise un tableau en deux sous-tableaux selon un prédicat.
 *
 * Le premier sous-tableau contient les éléments pour lesquels `predicate`
 * retourne `true`, le second ceux pour lesquels il retourne `false`.
 * L'ordre relatif des éléments est préservé dans chaque sous-tableau.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source à diviser.
 * @param predicate - La fonction de test appliquée à chaque élément.
 * @returns Un tuple `[truthy[], falsy[]]` contenant les deux sous-tableaux.
 *
 * @example
 * ```ts
 * partition([1, 2, 3, 4, 5], x => x % 2 === 0)
 * // → [[2, 4], [1, 3, 5]]
 *
 * partition(['alice', 'bob', 'anna'], s => s.startsWith('a'))
 * // → [['alice', 'anna'], ['bob']]
 *
 * partition([], x => x > 0)
 * // → [[], []]
 * ```
 */
export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const result: [T[], T[]] = [[], []];
  for (let i = 0, len = arr.length; i < len; ++i) {
    const element = arr[i];
    result[predicate(element) ? 0 : 1].push(element);
  }
  return result;
}

/**
 * Divise un tableau en deux sous-tableaux nommés selon un prédicat.
 *
 * Variante de {@link partition} retournant un objet `{ pass, fail }` plutôt
 * qu'un tuple, pour un accès nommé plus expressif sans destructuring positionnel.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source à diviser.
 * @param predicate - La fonction de test appliquée à chaque élément.
 * @returns Un objet contenant `pass` (éléments satisfaisant le prédicat)
 * et `fail` (éléments ne le satisfaisant pas).
 *
 * @example
 * ```ts
 * partitionToObject([1, 2, 3, 4, 5], x => x % 2 === 0)
 * // → { pass: [2, 4], fail: [1, 3, 5] }
 *
 * partitionToObject(['alice', 'bob', 'anna'], s => s.startsWith('a'))
 * // → { pass: ['alice', 'anna'], fail: ['bob'] }
 * ```
 *
 * @see {@link partition} pour la variante tuple `[pass, fail]`.
 */
export function partitionToObject<T>(
  arr: T[],
  predicate: (item: T) => boolean,
): { pass: T[]; fail: T[] } {
  const [pass, fail] = partition(arr, predicate);
  return { pass, fail };
}

/**
 * Fonction interne partagée entre {@link intersection} et {@link difference}.
 *
 * Parcourt `a` en une seule passe et conserve les éléments dont la présence
 * dans `bSet` correspond au drapeau `bhas`, en dédupliquant à la volée.
 *
 * @internal
 * @typeParam T - Type des éléments des tableaux.
 * @param a - Tableau source à parcourir.
 * @param b - Tableau utilisé pour construire l'ensemble de référence.
 * @param bhas - `true` pour garder les éléments présents dans `b` (intersection),
 *               `false` pour garder les éléments absents de `b` (difference).
 * @returns Un nouveau tableau dédupliqué, ordonné selon `a`.
 */
function _englobeFunction<T>(a: T[], b: T[], bhas: boolean): T[] {
  const bSet = new Set(b);
  const seen = new Set<T>();
  const result: T[] = [];

  for (let i = 0, len = a.length; i < len; ++i) {
    const x = a[i];
    if (bSet.has(x) === bhas && !seen.has(x)) {
      seen.add(x);
      result.push(x);
    }
  }

  return result;
}

/**
 * Retourne les éléments présents à la fois dans `a` et dans `b`, sans doublons.
 *
 * L'ordre des éléments est celui de leur première apparition dans `a`.
 * Les deux tableaux d'origine ne sont pas mutés.
 *
 * @typeParam T - Type des éléments des tableaux.
 * @param a - Premier tableau source.
 * @param b - Second tableau source utilisé comme filtre.
 * @returns Un nouveau tableau contenant les éléments communs aux deux tableaux, sans doublon.
 *
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 3, 4])   // → [2, 3]
 * intersection([1, 1, 2], [1, 2])      // → [1, 2]
 * intersection(['a', 'b'], ['b', 'c']) // → ['b']
 * intersection([1, 2], [3, 4])         // → []
 * ```
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  return _englobeFunction(a, b, true);
}

/**
 * Retourne les éléments présents dans `a` mais absents de `b`, sans doublons.
 *
 * L'ordre des éléments est celui de leur première apparition dans `a`.
 * Les deux tableaux d'origine ne sont pas mutés.
 *
 * @typeParam T - Type des éléments des tableaux.
 * @param a - Tableau source dont on extrait les éléments.
 * @param b - Tableau des éléments à exclure.
 * @returns Un nouveau tableau contenant les éléments de `a` absents de `b`, sans doublon.
 *
 * @example
 * ```ts
 * difference([1, 2, 3], [2, 3, 4]) // → [1]
 * difference([1, 1, 2], [2])       // → [1]
 * difference([1, 2, 3], [])        // → [1, 2, 3]
 * difference([], [1, 2, 3])        // → []
 * ```
 */
export function difference<T>(a: T[], b: T[]): T[] {
  return _englobeFunction(a, b, false);
}

/**
 * Retourne tous les éléments de `a` et de `b` réunis, sans doublons.
 *
 * L'ordre des éléments est celui de leur première apparition dans la
 * concaténation `[...a, ...b]`. Les deux tableaux d'origine ne sont pas mutés.
 *
 * @typeParam T - Type des éléments des tableaux.
 * @param a - Premier tableau source.
 * @param b - Second tableau source.
 * @returns Un nouveau tableau contenant tous les éléments des deux tableaux, sans doublon.
 *
 * @example
 * ```ts
 * union([1, 2, 3], [2, 3, 4]) // → [1, 2, 3, 4]
 * union([1, 1, 2], [2, 3])    // → [1, 2, 3]
 * union([], [1, 2])            // → [1, 2]
 * union([1, 2], [])            // → [1, 2]
 * ```
 */
export function union<T>(a: T[], b: T[]): T[] {
  return unique([...a, ...b]);
}

/**
 * Combine deux tableaux en un tableau de paires, en s'arrêtant au tableau le plus court.
 *
 * Chaque élément du tableau résultant est un tuple `[A, B]` associant
 * l'élément de `a` et celui de `b` au même index.
 * Les deux tableaux d'origine ne sont pas mutés.
 *
 * @typeParam A - Type des éléments du premier tableau.
 * @typeParam B - Type des éléments du second tableau.
 * @param a - Premier tableau source.
 * @param b - Second tableau source.
 * @returns Un tableau de tuples `[A, B]` de longueur `Math.min(a.length, b.length)`.
 *
 * @example
 * ```ts
 * zip([1, 2, 3], ['a', 'b', 'c']) // → [[1, 'a'], [2, 'b'], [3, 'c']]
 * zip([1, 2, 3], ['a', 'b'])      // → [[1, 'a'], [2, 'b']]  (s'arrête au plus court)
 * zip([], [1, 2, 3])              // → []
 * ```
 */
export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  const len = Math.min(a.length, b.length);
  const result: [A, B][] = new Array(len);

  for (let i = 0; i < len; ++i) {
    result[i] = [a[i], b[i]];
  }

  return result;
}

/**
 * Retourne les `n` premiers éléments du tableau.
 *
 * Si `n` est supérieur ou égal à la longueur du tableau, une copie complète
 * est retournée. Le tableau d'origine n'est pas muté.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source.
 * @param n - Le nombre d'éléments à conserver depuis le début.
 * @returns Un nouveau tableau contenant au plus `n` éléments.
 *
 * @example
 * ```ts
 * take([1, 2, 3, 4, 5], 3) // → [1, 2, 3]
 * take([1, 2, 3], 5)        // → [1, 2, 3]
 * take([1, 2, 3], 0)        // → []
 * ```
 */
export function take<T>(arr: T[], n: uint): T[] {
  return arr.slice(0, n);
}

/**
 * Retourne le tableau sans les `n` premiers éléments.
 *
 * Si `n` est supérieur ou égal à la longueur du tableau, un tableau vide
 * est retourné. Le tableau d'origine n'est pas muté.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source.
 * @param n - Le nombre d'éléments à supprimer depuis le début.
 * @returns Un nouveau tableau sans les `n` premiers éléments.
 *
 * @example
 * ```ts
 * drop([1, 2, 3, 4, 5], 2) // → [3, 4, 5]
 * drop([1, 2, 3], 5)        // → []
 * drop([1, 2, 3], 0)        // → [1, 2, 3]
 * ```
 */
export function drop<T>(arr: T[], n: uint): T[] {
  return arr.slice(n);
}

/**
 * Retourne une copie du tableau avec les éléments dans un ordre aléatoire.
 *
 * Utilise l'algorithme de Fisher-Yates (Knuth shuffle) : pour chaque position
 * en partant de la fin, on échange l'élément courant avec un élément choisi
 * aléatoirement parmi les positions restantes (0 à i inclus).
 * Le tableau d'origine n'est pas muté.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source à mélanger.
 * @returns Un nouveau tableau contenant les mêmes éléments dans un ordre aléatoire.
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]) // → [3, 1, 5, 2, 4]  (ordre variable)
 * shuffle([])              // → []
 * shuffle([42])            // → [42]
 * ```
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

/**
 * Fonction interne partagée entre {@link minBy} et {@link maxBy}.
 *
 * Parcourt `arr` en une seule passe et retourne l'élément dont la valeur
 * extraite par `fn` est la plus petite (`isMin: true`) ou la plus grande
 * (`isMin: false`).
 *
 * @internal
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Tableau source à parcourir.
 * @param fn - Fonction d'extraction de la valeur numérique de comparaison.
 * @param isMin - `true` pour rechercher le minimum, `false` pour le maximum.
 * @returns L'élément optimal, ou `null` si le tableau est vide.
 */
function _minMaxBy<T>(
  arr: T[],
  fn: (item: T) => number,
  { isMin }: { isMin: boolean },
): Nullable<T> {
  if (!arr || arr.length === 0) return null;

  let value: Nullable<number> = null;
  let index = 0;

  for (let i = 0, len = arr.length; i < len; ++i) {
    const result = fn(arr[i]);
    if (
      !isDefined(value) ||
      (isMin && value > result) ||
      (!isMin && result > value)
    ) {
      value = result;
      index = i;
    }
  }

  return arr[index];
}

/**
 * Retourne l'élément du tableau dont la valeur extraite par `fn` est la plus petite.
 *
 * En cas d'égalité, le premier élément rencontré est retourné.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source.
 * @param fn - Fonction d'extraction de la valeur numérique de comparaison.
 * @returns L'élément minimal selon `fn`, ou `null` si le tableau est vide.
 *
 * @example
 * ```ts
 * minBy([{ n: 3 }, { n: 1 }, { n: 2 }], x => x.n) // → { n: 1 }
 * minBy([], x => x)                                 // → null
 * ```
 */
export function minBy<T>(arr: T[], fn: (item: T) => number): Nullable<T> {
  return _minMaxBy(arr, fn, { isMin: true });
}

/**
 * Retourne l'élément du tableau dont la valeur extraite par `fn` est la plus grande.
 *
 * En cas d'égalité, le premier élément rencontré est retourné.
 *
 * @typeParam T - Type des éléments du tableau.
 * @param arr - Le tableau source.
 * @param fn - Fonction d'extraction de la valeur numérique de comparaison.
 * @returns L'élément maximal selon `fn`, ou `null` si le tableau est vide.
 *
 * @example
 * ```ts
 * maxBy([{ n: 3 }, { n: 1 }, { n: 2 }], x => x.n) // → { n: 3 }
 * maxBy([], x => x)                                 // → null
 * ```
 */
export function maxBy<T>(arr: T[], fn: (item: T) => number): Nullable<T> {
  return _minMaxBy(arr, fn, { isMin: false });
}
