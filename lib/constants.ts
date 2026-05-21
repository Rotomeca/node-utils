import { float, int, ufloat, uint } from "./types";

/**
 * Représente un string vide.
 * 
 * Cela permet d'améliorer la visualisation du code, un peu comme `string.Empty` en `C#`.
 * @see {@link https://learn.microsoft.com/fr-fr/dotnet/api/system.string.empty?view=net-9.0}
 */
export const EMPTY_STRING = '';
/**
 * Représente un espace.
 * 
 * Cela permet d'améliorer la visualisation du code, dans le même esprit que {@link EMPTY_STRING}
 */
export const SPACE = ' ';


// ============================================================
// NOMBRES NON SIGNÉS (UINT)
// ============================================================

/**
 * Zéro non signé — {@link uint} `0`.
 * @group Uint
 */
export const UI_ZERO: uint = 0 as uint;

/**
 * Un non signé — {@link uint} `1`.
 * @group Uint
 */
export const UI_ONE: uint = 1 as uint;

/**
 * Deux non signé — {@link uint} `2`.
 * @group Uint
 */
export const UI_TWO: uint = 2 as uint;

/**
 * Dix non signé — {@link uint} `10`.
 * @group Uint
 */
export const UI_TEN: uint = 10 as uint;

/**
 * Cent non signé — {@link uint} `100`.
 * @group Uint
 */
export const UI_HUNDRED: uint = 100 as uint;

// ============================================================
// NOMBRES SIGNÉS (INT)
// ============================================================

/**
 * Zéro signé — {@link int} `0`.
 * @group Int
 */
export const I_ZERO: int = 0 as int;

/**
 * Un signé — {@link int} `1`.
 * @group Int
 */
export const I_ONE: int = 1 as int;

/**
 * Dix signé — {@link int} `10`.
 * @group Int
 */
export const I_TEN: int = 10 as int;

/**
 * Cent signé — {@link int} `100`.
 * @group Int
 */
export const I_HUNDRED: int = 100 as int;

/**
 * Moins un — {@link int} `-1`.
 * Valeur sentinelle courante pour signaler une absence ou un index invalide.
 * @group Int
 */
export const I_MINUS_ONE: int = -1 as int;

/**
 * Moins dix — {@link int} `-10`.
 * @group Int
 */
export const I_MINUS_TEN: int = -10 as int;

/**
 * Moins cent — {@link int} `-100`.
 * @group Int
 */
export const I_MINUS_HUNDRED: int = -100 as int;

// ============================================================
// FLOTTANTS SIGNÉS (FLOAT)
// ============================================================

/**
 * Zéro flottant — {@link float} `0.0`.
 * @group Float
 */
export const F_ZERO: float = 0.0 as float;

/**
 * Un flottant — {@link float} `1.0`.
 * Identité multiplicative ; utile comme valeur par défaut de facteur ou d'opacité.
 * @group Float
 */
export const F_ONE: float = 1.0 as float;

/**
 * Demi flottant — {@link float} `0.5`.
 * Valeur médiane de l'intervalle `[0, 1]`, typiquement utilisée pour les interpolations.
 * @group Float
 */
export const F_HALF: float = 0.5 as float;

/**
 * Dix flottant — {@link float} `10.0`.
 * @group Float
 */
export const F_TEN: float = 10.0 as float;

/**
 * Cent flottant — {@link float} `100.0`.
 * Correspond à 100 % dans les calculs de pourcentage.
 * @group Float
 */
export const F_HUNDRED: float = 100.0 as float;

/**
 * Moins un flottant — {@link float} `-1.0`.
 * Inverse additif de {@link F_ONE} ; utilisé pour des directions ou des polarités opposées.
 * @group Float
 */
export const F_MINUS_ONE: float = -1.0 as float;

/**
 * Moins demi flottant — {@link float} `-0.5`.
 * Inverse additif de {@link F_HALF}.
 * @group Float
 */
export const F_MINUS_HALF: float = -0.5 as float;

/**
 * Moins dix flottant — {@link float} `-10.0`.
 * @group Float
 */
export const F_MINUS_TEN: float = -10.0 as float;

/**
 * Moins cent flottant — {@link float} `-100.0`.
 * @group Float
 */
export const F_MINUS_HUNDRED: float = -100.0 as float;

// ============================================================
// FLOTTANTS NON SIGNÉS (UFLOAT)
// ============================================================

/**
 * Zéro flottant non signé — {@link ufloat} `0.0`.
 * Borne inférieure naturelle du domaine `ufloat`.
 * @group Ufloat
 */
export const UF_ZERO: ufloat = 0.0 as ufloat;

/**
 * Un flottant non signé — {@link ufloat} `1.0`.
 * Borne supérieure de l'intervalle normalisé `[0, 1]` (ex. opacité, pourcentage unitaire).
 * @group Ufloat
 */
export const UF_ONE: ufloat = 1.0 as ufloat;

/**
 * Demi flottant non signé — {@link ufloat} `0.5`.
 * Point médian de l'intervalle normalisé ; valeur par défaut fréquente pour les curseurs.
 * @group Ufloat
 */
export const UF_HALF: ufloat = 0.5 as ufloat;

/**
 * Dix flottant non signé — {@link ufloat} `10.0`.
 * @group Ufloat
 */
export const UF_TEN: ufloat = 10.0 as ufloat;

/**
 * Cent flottant non signé — {@link ufloat} `100.0`.
 * Représente 100 % dans les échelles de pourcentage non signées.
 * @group Ufloat
 */
export const UF_HUNDRED: ufloat = 100.0 as ufloat;