import { MayBe, Optional, uint } from "./types";

/**
 * Utilitaires pour les tableaux.
 *
 * Ce module fournit plusieurs fonctions utilitaires pour travailler avec des
 * tableaux typés en TypeScript. La documentation est fournie au format
 * TypeDoc (français).
 *
 * @packageDocumentation
 */

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
export function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, Optional<T[]>> {
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
        if (typeof a.key === 'number' && typeof b.key === 'number') {
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