import { MayBe, uint } from "./types";

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

// export function intersection<T>(a: T[], b: T[]): T[] {
//   let bSet = new Set(b);

//   return a.filter(x => x)
// }
