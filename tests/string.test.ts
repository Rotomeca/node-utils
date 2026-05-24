import { describe, it, expect, afterEach, vi } from "vitest";
import {
  capitalize,
  capitalizeLine,
  slugify,
  toCamelCase,
  toSnakeCase,
  toPascalCase,
  isNullOrWhiteSpace,
  truncate,
  CapitalizeLine,
  Capitalize,
  template,
  countOccurrences,
  reverse,
  words,
} from "../lib/string";
import { UI_TEN } from "../lib/constants";
import { Uint } from "../lib/brandedproxy";

describe("string", () => {
  // ── capitalize ──────────────────────────────────────────────
  describe("capitalize", () => {
    it("met la première lettre en majuscule", () => {
      expect(capitalize("bonjour")).toBe("Bonjour");
    });
    it("ne change pas le reste", () => {
      expect(capitalize("bONJOUR")).toBe("BONJOUR");
    });
    it("gère une chaîne vide", () => {
      expect(capitalize("")).toBe("");
    });
  });

  // ── capitalizeLine ──────────────────────────────────────────
  describe("capitalizeLine", () => {
    it("capitalise chaque mot", () => {
      expect(capitalizeLine("bonjour le monde")).toBe("Bonjour Le Monde");
    });
    it("gère un seul mot", () => {
      expect(capitalizeLine("hello")).toBe("Hello");
    });
  });

  // ── slugify ─────────────────────────────────────────────────
  describe("slugify", () => {
    it("convertit en minuscules avec tirets", () => {
      expect(slugify("Bonjour Le Monde")).toBe("bonjour-le-monde");
    });
    it("supprime les accents", () => {
      expect(slugify("Élève àccentué")).toBe("eleve-accentue");
    });
    it("supprime les caractères spéciaux", () => {
      expect(slugify("hello@world!")).toBe("helloworld");
    });
    it("remplace les espaces multiples par un tiret", () => {
      expect(slugify("a   b")).toBe("a-b");
    });
    it("retire les tirets en bordure", () => {
      expect(slugify("  hello  ")).toBe("hello");
    });
    it("retourne le branded type SlugifiedString", () => {
      const s = slugify("test");
      expect(typeof s).toBe("string");
    });
  });

  // ── toCamelCase ─────────────────────────────────────────────
  describe("toCamelCase", () => {
    it("convertit kebab-case en camelCase", () => {
      expect(toCamelCase("bonjour-le-monde")).toBe("bonjourLeMonde");
    });
    it("convertit snake_case en camelCase", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
    });
    it("convertit PascalCase en camelCase", () => {
      expect(toCamelCase("HelloWorld")).toBe("helloWorld");
    });
    it("gère les espaces", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
    });
  });

  // ── toSnakeCase ─────────────────────────────────────────────
  describe("toSnakeCase", () => {
    it("convertit camelCase en snake_case", () => {
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
    });
    it("convertit PascalCase en snake_case", () => {
      expect(toSnakeCase("BonjourLeMonde")).toBe("bonjour_le_monde");
    });
    it("remplace les tirets par des underscores", () => {
      expect(toSnakeCase("foo-bar")).toBe("foo_bar");
    });
    it("gère les espaces", () => {
      expect(toSnakeCase("Bonjour Le Monde")).toBe("bonjour_le_monde");
    });
    it("évite les underscores multiples", () => {
      expect(toSnakeCase("foo--bar")).toBe("foo_bar");
    });
  });

  // ── toPascalCase ────────────────────────────────────────────
  describe("toPascalCase", () => {
    it("convertit snake_case en PascalCase", () => {
      expect(toPascalCase("bonjour_le_monde")).toBe("BonjourLeMonde");
    });
    it("convertit camelCase en PascalCase", () => {
      expect(toPascalCase("helloWorld")).toBe("HelloWorld");
    });
    it("gère une chaîne vide", () => {
      expect(toPascalCase("")).toBe("");
    });
  });

  // ── isNullOrWhiteSpace ──────────────────────────────────────
  describe("isNullOrWhiteSpace", () => {
    it("retourne true pour null", () => {
      expect(isNullOrWhiteSpace(null)).toBe(true);
    });
    it("retourne true pour undefined", () => {
      expect(isNullOrWhiteSpace(undefined)).toBe(true);
    });
    it("retourne true pour une chaîne vide", () => {
      expect(isNullOrWhiteSpace("")).toBe(true);
    });
    it("retourne true pour des espaces uniquement", () => {
      expect(isNullOrWhiteSpace("   \n\t  ")).toBe(true);
    });
    it("retourne false pour une chaîne non vide", () => {
      expect(isNullOrWhiteSpace("texte")).toBe(false);
    });
    it("retourne false pour une chaîne avec contenu entouré d'espaces", () => {
      expect(isNullOrWhiteSpace("  texte  ")).toBe(false);
    });
  });

  // ── truncate ────────────────────────────────────────────────
  describe("truncate", () => {
    it("tronque une chaîne trop longue", () => {
      expect(truncate("Bonjour le monde", UI_TEN)).toBe("Bonjour...");
    });
    it("ne tronque pas si la chaîne est dans la limite", () => {
      expect(truncate("Hello", UI_TEN)).toBe("Hello");
    });
    it("utilise l'ellipsis personnalisée", () => {
      expect(truncate("Un texte long", Uint[12], " [...]")).toBe(
        "Un tex [...]",
      );
    });
    it("gère les cas où max < longueur ellipsis", () => {
      const result = truncate("texte", Uint[2]);
      expect(result.length).toBeLessThanOrEqual(2);
    });
    it("ne tronque pas une chaîne exactement à la limite", () => {
      expect(truncate("Hello", Uint[5])).toBe("Hello");
    });
  });
  describe("Capitalize (déprécié)", () => {
    it("Délègue à capitalize et met la première lettre en majuscule", () => {
      expect(Capitalize("hello")).toBe("Hello");
    });

    it("Fonctionne avec une chaîne déjà en majuscule", () => {
      expect(Capitalize("Hello")).toBe("Hello");
    });
  });

  describe("CapitalizeLine (déprécié)", () => {
    it("Délègue à capitalizeLine et capitalise chaque mot", () => {
      expect(CapitalizeLine("hello world")).toBe("Hello World");
    });

    it("Fonctionne avec un seul mot", () => {
      expect(CapitalizeLine("bonjour")).toBe("Bonjour");
    });
  });
  describe("truncate — branche edge <= 0", () => {
    it("Tronque le suffixe lui-même si max est inférieur à sa longueur", () => {
      // ellipsis = '...' (3 chars), max = 2 → edge = 2 - 3 = -1 <= 0
      // retourne ellipsis.slice(0, 2) = '..'
      expect(truncate("bonjour", 2 as any)).toBe("..");
    });

    it("Retourne le premier caractère du suffixe si max vaut 1", () => {
      expect(truncate("bonjour", 1 as any)).toBe(".");
    });

    it("Retourne un suffixe vide si max vaut 0", () => {
      expect(truncate("bonjour", 0 as any)).toBe("");
    });

    it("Fonctionne avec un suffixe personnalisé plus long que max", () => {
      // ellipsis = ' [...]' (6 chars), max = 3 → edge = 3 - 6 = -3 <= 0
      // retourne ' [...]'.slice(0, 3) = ' [.'
      expect(truncate("bonjour le monde", 3 as any, " [...]")).toBe(" [.");
    });
  });
  describe("template", () => {
    it("Remplace un marqueur simple par sa valeur", () => {
      expect(template("Bonjour {prenom} !", { prenom: "Alice" })).toBe(
        "Bonjour Alice !",
      );
    });

    it("Remplace plusieurs marqueurs distincts", () => {
      expect(template("{a} + {b} = {c}", { a: 1, b: 2, c: 3 })).toBe(
        "1 + 2 = 3",
      );
    });

    it("Remplace un marqueur apparaissant plusieurs fois", () => {
      expect(template("{x} et {x}", { x: "hop" })).toBe("hop et hop");
    });

    it("Remplace une valeur numérique par sa représentation en chaîne", () => {
      expect(template("Valeur : {n}", { n: 42 })).toBe("Valeur : 42");
    });

    it("Remplace une valeur numérique égale à zéro correctement", () => {
      expect(template("Score : {n}", { n: 0 })).toBe("Score : 0");
    });

    it("Remplace par une chaîne vide si la clé est absente du dictionnaire", () => {
      expect(template("Valeur : {x}", {})).toBe("Valeur : ");
    });

    it("Retourne la chaîne intacte si elle ne contient aucun marqueur", () => {
      expect(template("Pas de marqueur", { foo: "bar" })).toBe(
        "Pas de marqueur",
      );
    });

    it("Retourne une chaîne vide si str est vide", () => {
      expect(template("", { foo: "bar" })).toBe("");
    });

    it("Ne mute pas le dictionnaire vars passé en argument", () => {
      const vars = { nom: "Bob" };
      const original = { ...vars };
      template("Bonjour {nom}", vars);
      expect(vars).toEqual(original);
    });

    it("Ignore les accolades non fermées ou malformées", () => {
      expect(template("{ non fermé", { x: "1" })).toBe("{ non fermé");
      expect(template("{} vide", { x: "1" })).toBe("{} vide");
    });
  });
  describe("countOccurrences", () => {
    it("Compte une occurrence unique", () => {
      expect(countOccurrences("bonjour", "jour")).toBe(1);
    });

    it("Compte plusieurs occurrences non chevauchantes", () => {
      expect(countOccurrences("abcabc", "a")).toBe(2);
    });

    it("Retourne 0 si la sous-chaîne est absente", () => {
      expect(countOccurrences("abc", "x")).toBe(0);
    });

    it("Retourne 0 si str est vide", () => {
      expect(countOccurrences("", "a")).toBe(0);
    });

    it("Retourne 0 si sub est une chaîne vide", () => {
      expect(countOccurrences("abc", "")).toBe(0);
    });

    it("Retourne 0 si str et sub sont tous les deux vides", () => {
      expect(countOccurrences("", "")).toBe(0);
    });

    it("Compte les occurrences non chevauchantes (aaa / aa → 1)", () => {
      expect(countOccurrences("aaa", "aa")).toBe(1);
    });

    it("Compte correctement une sous-chaîne de plusieurs caractères", () => {
      expect(countOccurrences("abababab", "ab")).toBe(4);
    });

    it("Est sensible à la casse", () => {
      expect(countOccurrences("AaAaAa", "a")).toBe(3);
    });

    it("Retourne un uint (nombre entier non signé)", () => {
      const result = countOccurrences("test", "t");
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it("Ne mute pas la chaîne source", () => {
      const original = "abcabc";
      countOccurrences(original, "a");
      expect(original).toBe("abcabc");
    });
  });
  describe("reverse", () => {
    it("Inverse une chaîne simple", () => {
      expect(reverse("bonjour")).toBe("ruojnob");
    });

    it("Inverse une chaîne avec espaces", () => {
      expect(reverse("hello world")).toBe("dlrow olleh");
    });

    it("Retourne une chaîne vide si str est vide", () => {
      expect(reverse("")).toBe("");
    });

    it("Retourne le même caractère pour une chaîne de longueur 1", () => {
      expect(reverse("a")).toBe("a");
    });

    it("Gère correctement les emojis simples (surrogate pairs)", () => {
      expect(reverse("😀😂")).toBe("😂😀");
    });

    it("Gère correctement les drapeaux (combining chars)", () => {
      expect(reverse("🇫🇷🇩🇪")).toBe("🇩🇪🇫🇷");
    });

    it("Gère correctement les emojis composés (ZWJ sequences)", () => {
      expect(reverse("👨‍👩‍👧👩‍💻")).toBe("👩‍💻👨‍👩‍👧");
    });

    it("Fonctionne sans passer de locale (paramètre optionnel)", () => {
      expect(reverse("abc")).toBe("cba");
    });

    it("Accepte une locale explicite", () => {
      expect(reverse("abc", { locales: "en-US" })).toBe("cba");
    });

    it("Ne mute pas la chaîne source", () => {
      const original = "bonjour";
      reverse(original);
      expect(original).toBe("bonjour");
    });
    it("Inverse une chaîne en japonais", () => {
      expect(reverse("日本語")).toBe("語本日");
    });

    it("Inverse une chaîne avec des caractères spéciaux", () => {
      expect(reverse("}§∟")).toBe("∟§}");
    });

    it("Inverse une chaîne mixte japonais et caractères spéciaux", () => {
      expect(reverse("日}§∟語")).toBe("語∟§}日");
    });

    describe("fallback — Intl.Segmenter indisponible", () => {
      afterEach(() => {
        vi.restoreAllMocks();
      });

      it("Utilise le fallback [...str] si Intl.Segmenter est absent", () => {
        vi.spyOn(Intl, "Segmenter", "get").mockReturnValue(undefined as any);
        expect(reverse("bonjour")).toBe("ruojnob");
      });

      it("Gère les surrogate pairs dans le fallback", () => {
        vi.spyOn(Intl, "Segmenter", "get").mockReturnValue(undefined as any);
        expect(reverse("😀😂")).toBe("😂😀");
      });
    });
  });
  describe("words", () => {
    it("Découpe une chaîne camelCase", () => {
      expect(words("helloWorld")).toEqual(["hello", "world"]);
    });

    it("Découpe une chaîne PascalCase", () => {
      expect(words("BonjourLeMonde")).toEqual(["bonjour", "le", "monde"]);
    });

    it("Découpe une chaîne kebab-case", () => {
      expect(words("foo-bar-baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("Découpe une chaîne snake_case", () => {
      expect(words("foo_bar_baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("Découpe une chaîne avec espaces", () => {
      expect(words("bonjour le monde")).toEqual(["bonjour", "le", "monde"]);
    });

    it("Gère les underscores multiples ou en bordure", () => {
      expect(words("__foo__bar__")).toEqual(["foo", "bar"]);
    });

    it("Gère les tirets multiples ou en bordure", () => {
      expect(words("--foo--bar--")).toEqual(["foo", "bar"]);
    });

    it("Gère les espaces en début et fin de chaîne", () => {
      expect(words("  hello world  ")).toEqual(["hello", "world"]);
    });

    it("Retourne un tableau vide si str est vide", () => {
      expect(words("")).toEqual([]);
    });

    it("Retourne un tableau vide si str ne contient que des espaces", () => {
      expect(words("   ")).toEqual([]);
    });

    it("Retourne un tableau à un seul élément pour un mot simple", () => {
      expect(words("bonjour")).toEqual(["bonjour"]);
    });

    it("Gère un mélange de séparateurs", () => {
      expect(words("foo_bar-baz HelloWorld")).toEqual([
        "foo",
        "bar",
        "baz",
        "hello",
        "world",
      ]);
    });

    it("Retourne les mots en minuscules", () => {
      expect(words("FOO_BAR")).toEqual(["foo", "bar"]);
    });

    it("Ne mute pas la chaîne source", () => {
      const original = "helloWorld";
      words(original);
      expect(original).toBe("helloWorld");
    });
  });
});
