import { EMPTY_STRING, SPACE } from "./constants";
import { MayBe, uint } from "./types";
import { DEFAULT_ELLIPSIS } from './private/config';

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

/**
 * Type brandé représentant une chaîne déjà transformée en slug.
 */
export type SlugifiedString = string & { readonly __brand: 'slug' };

/**
 * Transforme une chaîne de caractères en slug sécurisé pour une URL ou un identifiant.
 *
 * Cette fonction normalise les accents, supprime les caractères invalides,
 * remplace les espaces et tirets consécutifs par un seul tiret, puis nettoie
 * les tirets en début et fin de chaîne.
 *
 * @param str Chaîne à convertir.
 * @returns Une chaîne au format slug.
 */
export function slugify(str: string): SlugifiedString {
    return str
        .normalize('NFD')                     // Décompose les accents (é → e + ◌́)
        .replace(/[\u0300-\u036f]/g, EMPTY_STRING)      // Supprime les diacritiques
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, EMPTY_STRING)         // Supprime tout sauf lettres, chiffres, espaces et tirets
        .trim()
        .replace(/[\s-]+/g, '-')              // Remplace (espaces ET/OU tirets consécutifs) par un seul tiret
        .replace(/^-+|-+$/g, EMPTY_STRING) as SlugifiedString; // Nettoie les éventuels tirets restants au début ou à la fin
}

/**
 * Type brandé représentant une chaîne formatée en camelCase.
 */
export type CamelCaseString = string & { readonly __brand: 'camelCase' };
/**
 * Convertit une chaîne de caractères en camelCase.
 * Gère les espaces, les tirets, les underscores et respecte la casse existante.
 * 
 * @param str - La chaîne à convertir.
 * @returns La chaîne au format camelCase.
 * 
 * @example
 * toCamelCase("bonjour-le-monde") // -> "bonjourLeMonde"
 * toCamelCase("Hello_world")      // -> "helloWorld"
 */
export function toCamelCase(str: string): CamelCaseString {
    return str
        // Nettoie les séparateurs en début de chaîne pour éviter les bugs
        .replace(/^[-_\s]+/, EMPTY_STRING)
        // Trouve un séparateur suivi d'un caractère, et met le caractère en majuscule
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : EMPTY_STRING))
        // Force la toute première lettre en minuscule (si on nous passe du PascalCase)
        .replace(/^[A-Z]/, (c) => c.toLowerCase()) as CamelCaseString;
}

/**
 * Type brandé représentant une chaîne formatée en snake_case.
 */
export type SnakeCaseString = string & { readonly __brand: 'snakeCase' };
/**
 * Convertit une chaîne de caractères en snake_case.
 * Transforme le camelCase, PascalCase, et remplace espaces/tirets par des underscores.
 * 
 * @param str - La chaîne à convertir.
 * @returns La chaîne au format snake_case.
 * 
 * @example
 * toSnakeCase("helloWorld")      // -> "hello_world"
 * toSnakeCase("Bonjour Le Monde") // -> "bonjour_le_monde"
 * toSnakeCase("foo-bar")         // -> "foo_bar"
 */
export function toSnakeCase(str: string): SnakeCaseString {
    return str
        // 1. Détecte la transition [minuscule/chiffre] vers [Majuscule] et insère un underscore
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        // 2. Remplace les espaces et les tirets par des underscores
        .replace(/[-\s]+/g, '_')
        // 3. Transforme tout en minuscules
        .toLowerCase()
        // 4. (Sécurité) Nettoie les underscores multiples ou en bordure
        .replace(/^_+|_+$/g, EMPTY_STRING)
        .replace(/_+/g, '_') as SnakeCaseString;
}

/**
 * Type brandé représentant une chaîne formatée en PascalCase.
 */
export type PascalCaseString = string & { readonly __brand: 'pascalCase' };
/**
 * Convertit une chaîne de caractères en PascalCase (UpperCamelCase).
 * 
 * @param str - La chaîne à convertir.
 * @returns La chaîne au format PascalCase.
 * 
 * @example
 * toPascalCase("bonjour_le-monde") // -> "BonjourLeMonde"
 */
export function toPascalCase(str: string): PascalCaseString {
    const camel = toCamelCase(str);
    if (!camel) return EMPTY_STRING as PascalCaseString;
    
    // On prend juste la première lettre qu'on met en majuscule, et on recolle le reste
    return camel.charAt(0).toUpperCase() + camel.slice(1) as PascalCaseString;
}

/**
 * Vérifie si une chaîne de caractères est nulle, non définie, vide ou 
 * composée uniquement d'espaces blancs (espaces, tabulations, retours à la ligne).
 * 
 * @param str - La chaîne à évaluer.
 * @returns `true` si la chaîne est vide de sens textuel, sinon `false`.
 * 
 * @example
 * isNullOrWhiteSpace(null)      // -> true
 * isNullOrWhiteSpace("   \n  ") // -> true
 * isNullOrWhiteSpace("texte")   // -> false
 */
export function isNUllOrWhiteSpace(str: MayBe<string>): boolean {
    if (str === null || str === undefined) return true;

    return str.trim() === EMPTY_STRING;
} 

/**
 * Tronque une chaîne de caractères si elle dépasse la longueur maximale spécifiée,
 * et y ajoute un suffixe (par défaut "...").
 * 
 * La longueur du résultat final (incluant le suffixe) ne dépassera jamais `max`.
 * 
 * @param str - La chaîne de caractères à tronquer.
 * @param max - La longueur maximale absolue de la chaîne retournée.
 * @param ellipsis - Le suffixe à ajouter si la chaîne est tronquée (défaut: {@link DEFAULT_ELLIPSIS}).
 * @returns La chaîne tronquée ou originale.
 * 
 * @example
 * truncate("Bonjour le monde", 10)         // -> "Bonjour..."
 * truncate("Hello", 10)                    // -> "Hello"
 * truncate("Un texte long", 12, " [...]")  // -> "Un t [...]"
 */
export function truncate(str: string, max: uint, ellipsis: string = DEFAULT_ELLIPSIS): string {
    if (str.length <= max) return str;
    

    const edge = max - ellipsis.length;

    // Sécurité de mise en page : si la taille max demandée est plus petite que 
    // les points de suspension, on tronque les points de suspension eux-mêmes.
    if (edge <= 0) return ellipsis.slice(0, max);
    
    return str.slice(0, edge) + ellipsis;
}