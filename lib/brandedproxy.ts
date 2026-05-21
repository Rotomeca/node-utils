import { float, int, toFloat, toInt, toUfloat, toUint, ufloat, uint } from "./types";

/**
 * Usine générique pour créer des proxies de nombres typés avec système de cache intégré.
 *
 * Chaque accès à une propriété numérique sur le proxy retourné (ex. `proxy[42]`) :
 * 1. Consulte d'abord le cache interne pour un accès en O(1) ;
 * 2. Ignore silencieusement les propriétés non numériques (ex. `toString`, `Symbol`) ;
 * 3. Valide et convertit la valeur via `validator`, puis la mémorise dans le cache.
 *
 * @template T - Le type brandé produit par le validateur (ex. `uint`, `float`).
 *
 * @param validator    - Fonction de conversion et de validation d'un nombre brut vers `T`.
 *                       Doit lever une erreur si la valeur est hors domaine.
 * @param prefillCache - Dictionnaire optionnel de valeurs pré-calculées pour les cas les
 *                       plus fréquents, afin d'éviter tout appel à `validator` sur ces
 *                       entrées. Par défaut : objet vide.
 *
 * @returns Un `Record<number, T>` implémenté par un `Proxy` qui valide à la demande
 *          et met en cache chaque résultat.
 *
 * @example
 * ```typescript
 * const MyUint = createBrandedProxy<uint>(toUint, { 0: 0 as uint });
 * const zero = MyUint[0];  // servi depuis le cache pré-rempli
 * const cent = MyUint[100]; // validé par toUint puis mis en cache
 * ```
 */
function createBrandedProxy<T>(
    validator: (n: number) => T,
    prefillCache: Record<string|number, T> = {}
): Record<number, T> {
    return new Proxy(prefillCache, {
        get: (target, prop) => {
            // 1. Lecture ultra-rapide depuis le cache
            if (prop in target) return target[prop as unknown as number];

            // 2. Sécurité : on ignore les appels de propriétés non numériques (ex: toString)
            const val = Number(prop);
            if (isNaN(val)) return undefined as any;

            // 3. Validation et mise en cache
            const brandedValue = validator(val);
            target[val] = brandedValue;

            return brandedValue;
        }
    }) as Record<number, T>;
}

// ============================================================
// INSTANCIATION DES PROXYS
// ============================================================

/**
 * Proxy de conversion vers le type {@link uint} (entier non signé).
 *
 * Intercepte tout accès numérique et retourne la valeur correspondante
 * validée par {@link toUint}. Les valeurs `0`, `1` et `2` sont pré-cachées.
 *
 * @example
 * ```typescript
 * const n = Uint[255]; // uint
 * ```
 */
export const Uint = createBrandedProxy<uint>(toUint, { 0: 0 as uint, 1: 1 as uint, 2: 2 as uint });

/**
 * Proxy de conversion vers le type {@link int} (entier signé).
 *
 * Intercepte tout accès numérique et retourne la valeur correspondante
 * validée par {@link toInt}. Les valeurs `-1`, `0` et `1` sont pré-cachées.
 *
 * @example
 * ```typescript
 * const n = Int[-42]; // int
 * ```
 */
export const Int = createBrandedProxy<int>(toInt, { 0: 0 as int, 1: 1 as int, '-1': -1 as int });

/**
 * Proxy de conversion vers le type {@link float} (flottant signé).
 *
 * Intercepte tout accès numérique et retourne la valeur correspondante
 * validée par {@link toFloat}. Les valeurs `0` et `1` sont pré-cachées.
 *
 * @example
 * ```typescript
 * const n = Float[3.14]; // float
 * ```
 */
export const Float = createBrandedProxy<float>(toFloat, { 0: 0 as float, 1: 1 as float });

/**
 * Proxy de conversion vers le type {@link ufloat} (flottant non signé).
 *
 * Intercepte tout accès numérique et retourne la valeur correspondante
 * validée par {@link toUfloat}. Les valeurs `0` et `1` sont pré-cachées.
 *
 * @example
 * ```typescript
 * const n = Ufloat[0.75]; // ufloat
 * ```
 */
export const Ufloat = createBrandedProxy<ufloat>(toUfloat, { 0: 0 as ufloat, 1: 1 as ufloat });