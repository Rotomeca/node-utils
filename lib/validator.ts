import { ALPHA_REGEX, EMAIL_REGEX, HEXA_REGEX, UUID_REGEX } from "./regex";

/**
 * Vérifie si une chaîne respecte le format minimal d'une adresse email.
 *
 * @param str - La chaîne à valider.
 * @returns `true` si la chaîne ressemble à une adresse email valide.
 *
 * @remarks
 * Validation permissive basée sur {@link EMAIL_REGEX} — ne garantit pas
 * l'existence de l'adresse. Pour une validation stricte, préférer un envoi
 * de confirmation.
 *
 * @example
 * ```ts
 * isEmail("user@example.com") // → true
 * isEmail("invalid")          // → false
 * isEmail("a@b")              // → false
 * ```
 */
export function isEmail(str: string): boolean {
    return EMAIL_REGEX.test(str);
}

/**
 * Vérifie si une chaîne est une URL valide avec protocole.
 *
 * Délègue à l'API native `URL` du navigateur ou de Node.js.
 *
 * @param str - La chaîne à valider.
 * @returns `true` si la chaîne est parseable comme une URL valide.
 *
 * @example
 * ```ts
 * isURL("https://example.com") // → true
 * isURL("ftp://files.io")      // → true
 * isURL("not a url")           // → false
 * isURL("example.com")         // → false (pas de protocole)
 * ```
 */
export function isURL(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

/**
 * Vérifie si une chaîne est un UUID au format standard.
 *
 * Format attendu : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, insensible à la casse.
 * Toutes les versions UUID (v1 à v5) sont acceptées.
 *
 * @param str - La chaîne à valider.
 * @returns `true` si la chaîne est un UUID valide.
 *
 * @example
 * ```ts
 * isUUID("550e8400-e29b-41d4-a716-446655440000") // → true
 * isUUID("not-a-uuid")                           // → false
 * ```
 */
export function isUUID(str: string): boolean {
    return UUID_REGEX.test(str);
}

/**
 * Vérifie si une chaîne représente un nombre valide (entier ou décimal).
 *
 * @param str - La chaîne à valider.
 * @returns `true` si la chaîne est convertible en nombre fini.
 *
 * @remarks
 * La chaîne `"3."` est considérée valide car `parseFloat("3.")` retourne `3`.
 * Les chaînes vides et les espaces seuls retournent `false`.
 *
 * @example
 * ```ts
 * isNumeric("42")    // → true
 * isNumeric("3.14")  // → true
 * isNumeric("-7")    // → true
 * isNumeric("abc")   // → false
 * isNumeric("")      // → false
 * isNumeric("  ")    // → false
 * ```
 */
export function isNumeric(str: string): boolean {
    return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

/**
 * Vérifie si une chaîne ne contient que des lettres alphabétiques.
 *
 * Supporte les caractères accentués courants (`À-ÿ`) en plus de l'ASCII de base.
 * Rejette les chiffres, espaces et caractères spéciaux.
 *
 * @param str - La chaîne à valider.
 * @returns `true` si la chaîne est composée uniquement de lettres.
 *
 * @example
 * ```ts
 * isAlpha("Bonjour") // → true
 * isAlpha("Éric")    // → true
 * isAlpha("hello2")  // → false
 * isAlpha("hi there") // → false
 * ```
 */
export function isAlpha(str: string): boolean {
    return ALPHA_REGEX.test(str);
}

/**
 * Vérifie si une chaîne est une couleur hexadécimale valide.
 *
 * Accepte les formats court (`#fff`) et long (`#ffffff`),
 * avec ou sans `#`, insensible à la casse.
 *
 * @param str - La chaîne à valider.
 * @returns `true` si la chaîne est une couleur hexadécimale valide.
 *
 * @example
 * ```ts
 * isHexColor("#fff")     // → true
 * isHexColor("#FF5733")  // → true
 * isHexColor("ff5733")   // → true  (sans #)
 * isHexColor("#gggggg")  // → false
 * isHexColor("red")      // → false
 * ```
 */
export function isHexColor(str: string): boolean {
    return HEXA_REGEX.test(str);
}