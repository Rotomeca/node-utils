import { float, toFloat, uint } from "./types";

/**
 * Contraint une valeur dans un intervalle `[min, max]`.
 *
 * @param value - La valeur à contraindre
 * @param min - La borne inférieure de l'intervalle
 * @param max - La borne supérieure de l'intervalle
 * @returns `min` si `value < min`, `max` si `value > max`, sinon `value`
 *
 * @example
 * clamp(15, 0, 10) // → 10
 * clamp(-5, 0, 10) // → 0
 * clamp(7,  0, 10) // → 7
 */
export function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    else if (value > max) return max;

    return value;
}

/**
 * Arrondit un nombre à un nombre donné de décimales.
 *
 * @param n - Le nombre à arrondir
 * @param decimals - Le nombre de décimales souhaité
 * @returns Le nombre arrondi à `decimals` décimales
 *
 * @example
 * roundTo(3.14159, 2) // → 3.14
 * roundTo(1.005, 2)   // → 1.01
 */
export function roundTo(n: float, decimals: uint): float {
    return toFloat(parseFloat(n.toFixed(decimals)));
}

/**
 * Vérifie si un nombre est compris dans un intervalle fermé `[min, max]`.
 *
 * @param n - Le nombre à tester
 * @param min - La borne inférieure de l'intervalle (incluse)
 * @param max - La borne supérieure de l'intervalle (incluse)
 * @returns `true` si `min ≤ n ≤ max`, `false` sinon
 *
 * @example
 * isInRange(5,  1, 10) // → true
 * isInRange(0,  1, 10) // → false
 * isInRange(10, 1, 10) // → true
 */
export function isInRange(n: number, min: number, max: number): boolean {
    return min <= n && n <= max;
}

/**
 * Calcule la moyenne arithmétique d'un tableau de nombres.
 *
 * @param arr - Le tableau de nombres
 * @returns La moyenne des éléments, ou `0` si le tableau est vide
 *
 * @example
 * average([1, 2, 3, 4]) // → 2.5
 * average([])           // → 0
 */
export function average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, n) => sum + n, 0) / arr.length;
}