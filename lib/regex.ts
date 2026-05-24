/**
 * Valide le format minimal d'une adresse email.
 * Vérifie la présence d'un `@`, d'un domaine et d'une extension.
 *
 * @remarks
 * Validation intentionnellement permissive — ne couvre pas l'intégralité
 * de la RFC 5322. Pour une validation stricte, préférer une vérification
 * côté serveur ou un envoi de confirmation.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valide le format standard d'un UUID (toutes versions).
 * Format attendu : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (insensible à la casse).
 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Valide qu'une chaîne ne contient que des lettres (avec support des caractères accentués).
 * Couvre les plages ASCII `a-z`, `A-Z` et les caractères latins étendus `À-ÿ`.
 */
export const ALPHA_REGEX = /^[a-zA-ZÀ-ÿ]+$/;

/**
 * Valide le format d'une couleur hexadécimale.
 * Accepte les formats court `#fff` et long `#ffffff`, avec ou sans `#` (insensible à la casse).
 */
export const HEXA_REGEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;