import { describe, it, expect } from "vitest";
import {
  capitalize,
  capitalizeLine,
  slugify,
  toCamelCase,
  toSnakeCase,
  toPascalCase,
  isNullOrWhiteSpace,
  truncate,
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
});
