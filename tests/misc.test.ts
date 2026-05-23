import { describe, it, expect, vi } from "vitest";
import { Uint, Int, Float, Ufloat } from "../lib/brandedproxy";
import { Random } from "../lib/random";
import { AStartObject } from "../lib/StartObject";
import { EMAIL_REGEX, UUID_REGEX, ALPHA_REGEX, HEXA_REGEX } from "../lib/regex";
import { toUint, toInt } from "../lib/types";

// ── BrandedProxy ─────────────────────────────────────────────
describe("BrandedProxy", () => {
  describe("Uint", () => {
    it("Retourne la valeur pour un entier positif", () => {
      expect(Uint[42]).toBe(42);
    });
    it("Retourne la valeur 0 (pré-cachée)", () => {
      expect(Uint[0]).toBe(0);
    });
    it("Retourne la valeur 1 (pré-cachée)", () => {
      expect(Uint[1]).toBe(1);
    });
    it("Retourne la valeur 2 (pré-cachée)", () => {
      expect(Uint[2]).toBe(2);
    });
    it("Met en cache le résultat au second accès", () => {
      Uint[99];
      expect(Uint[99]).toBe(99);
    });
    it("Lève une erreur pour un entier négatif", () => {
      expect(() => Uint[-1]).toThrow();
    });
    it("Lève une erreur pour un flottant", () => {
      expect(() => Uint[1.5]).toThrow();
    });
    it("Retourne undefined pour une propriété non numérique", () => {
      expect((Uint as any)["foo"]).toBeUndefined();
    });
  });

  describe("Int", () => {
    it("Retourne la valeur pour un entier positif", () => {
      expect(Int[10]).toBe(10);
    });
    it("Retourne la valeur pour un entier négatif", () => {
      expect(Int[-5]).toBe(-5);
    });
    it("Retourne 0 (pré-caché)", () => {
      expect(Int[0]).toBe(0);
    });
    it("Retourne -1 (pré-caché)", () => {
      expect(Int[-1]).toBe(-1);
    });
    it("Lève une erreur pour un flottant", () => {
      expect(() => Int[3.14]).toThrow();
    });
    it("Retourne undefined pour une propriété non numérique", () => {
      expect((Int as any)["bar"]).toBeUndefined();
    });
  });

  describe("Float", () => {
    it("Retourne la valeur pour un flottant positif", () => {
      expect(Float[3.14]).toBeCloseTo(3.14);
    });
    it("Retourne la valeur pour un flottant négatif", () => {
      expect(Float[-2.5]).toBeCloseTo(-2.5);
    });
    it("Retourne 0 (pré-caché)", () => {
      expect(Float[0]).toBe(0);
    });
    it("Retourne 1 (pré-caché)", () => {
      expect(Float[1]).toBe(1);
    });
    it("Lève une erreur pour Infinity", () => {
      expect(() => Float[Infinity]).toThrow();
    });
    it("Retourne undefined pour NaN (court-circuité par le guard isNaN)", () => {
      expect((Float as any)[NaN]).toBeUndefined();
    });
  });

  describe("Ufloat", () => {
    it("Retourne la valeur pour un flottant positif", () => {
      expect(Ufloat[0.75]).toBeCloseTo(0.75);
    });
    it("Retourne 0 (pré-caché)", () => {
      expect(Ufloat[0]).toBe(0);
    });
    it("Retourne 1 (pré-caché)", () => {
      expect(Ufloat[1]).toBe(1);
    });
    it("Lève une erreur pour un flottant négatif", () => {
      expect(() => Ufloat[-0.5]).toThrow();
    });
    it("Lève une erreur pour Infinity", () => {
      expect(() => Ufloat[Infinity]).toThrow();
    });
  });
});

// ── Random ───────────────────────────────────────────────────
describe("Random", () => {
  describe("intRange", () => {
    it("Retourne un entier dans l'intervalle [min, max[", () => {
      const min = toInt(1);
      const max = toInt(10);
      for (let i = 0; i < 50; i++) {
        const result = Random.intRange(min, max);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThan(10);
      }
    });
    it("Retourne toujours min quand min === max - 1", () => {
      const result = Random.intRange(toInt(5), toInt(6));
      expect(result).toBe(5);
    });
    it("Retourne un entier (pas de flottant)", () => {
      const result = Random.intRange(toInt(0), toInt(100));
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe("range", () => {
    it("Retourne un nombre dans l'intervalle [min, max[", () => {
      for (let i = 0; i < 50; i++) {
        const result = Random.range(0, 1);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
      }
    });
    it("Fonctionne avec des intervalles négatifs", () => {
      for (let i = 0; i < 20; i++) {
        const result = Random.range(-10, -1);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThan(-1);
      }
    });
    it("Retourne toujours min si min === max", () => {
      expect(Random.range(5, 5)).toBe(5);
    });
  });

  describe("randomString", () => {
    it("Retourne une chaîne de la longueur demandée", () => {
      expect(Random.randomString(toUint(10))).toHaveLength(10);
    });
    it("Retourne une chaîne vide si size est 0", () => {
      expect(Random.randomString(toUint(0))).toBe("");
    });
    it("Ne contient que des lettres minuscules", () => {
      const result = Random.randomString(toUint(100));
      expect(/^[a-z]+$/.test(result)).toBe(true);
    });
    it("Génère des chaînes différentes à chaque appel (probabiliste)", () => {
      const a = Random.randomString(toUint(20));
      const b = Random.randomString(toUint(20));
      // Probabilité de collision ≈ 1/(26^20) — négligeable
      expect(a).not.toBe(b);
    });
  });

  describe("random_string (deprecated)", () => {
    it("Délègue à randomString et retourne la même longueur", () => {
      const result = Random.random_string(toUint(8));
      expect(result).toHaveLength(8);
    });
  });
});

// ── AStartObject ─────────────────────────────────────────────
describe("AStartObject", () => {
  it("Exécute _p_init puis _p_main dans l'ordre", () => {
    const order: string[] = [];

    class TestService extends AStartObject {
      protected _p_init(): void {
        order.push("init");
      }
      protected _p_main(): void {
        order.push("main");
      }
    }

    TestService.Start();
    expect(order).toEqual(["init", "main"]);
  });

  it("Retourne une instance de la sous-classe", () => {
    class MyService extends AStartObject {}
    const instance = MyService.Start();
    expect(instance).toBeInstanceOf(MyService);
  });

  it("Transmet les arguments à _p_init", () => {
    let received: unknown[] = [];

    class ArgsService extends AStartObject {
      protected _p_init(...args: unknown[]): void {
        received = args;
      }
    }

    ArgsService.Start(42, "hello", true);
    expect(received).toEqual([42, "hello", true]);
  });

  it("_p_main est appelé même sans arguments", () => {
    let mainCalled = false;

    class SimpleService extends AStartObject {
      protected _p_main(): void {
        mainCalled = true;
      }
    }

    SimpleService.Start();
    expect(mainCalled).toBe(true);
  });

  it("Les sous-classes peuvent stocker l'état initialisé dans _p_init", () => {
    class StatefulService extends AStartObject {
      public value = 0;
      protected _p_init(v: unknown): void {
        this.value = v as number;
      }
    }

    const instance = StatefulService.Start(99) as StatefulService;
    expect(instance.value).toBe(99);
  });

  it("Chaque appel à Start retourne une nouvelle instance", () => {
    class FreshService extends AStartObject {}
    const a = FreshService.Start();
    const b = FreshService.Start();
    expect(a).not.toBe(b);
  });

  it("_p_init et _p_main par défaut ne lèvent pas d'erreur", () => {
    class EmptyService extends AStartObject {}
    expect(() => EmptyService.Start()).not.toThrow();
  });
});

// ── Regex ─────────────────────────────────────────────────────
describe("Regex", () => {
  describe("EMAIL_REGEX", () => {
    it("Valide les emails corrects", () => {
      expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("first.last@sub.domain.fr")).toBe(true);
      expect(EMAIL_REGEX.test("user+tag@domain.io")).toBe(true);
    });
    it("Rejette les emails invalides", () => {
      expect(EMAIL_REGEX.test("invalid")).toBe(false);
      expect(EMAIL_REGEX.test("@domain.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@")).toBe(false);
      expect(EMAIL_REGEX.test("user@domain")).toBe(false);
      expect(EMAIL_REGEX.test("")).toBe(false);
    });
    it("Rejette les emails avec espaces", () => {
      expect(EMAIL_REGEX.test("us er@domain.com")).toBe(false);
    });
  });

  describe("UUID_REGEX", () => {
    it("Valide un UUID v4 standard", () => {
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-446655440000")).toBe(
        true,
      );
    });
    it("Est insensible à la casse", () => {
      expect(UUID_REGEX.test("550E8400-E29B-41D4-A716-446655440000")).toBe(
        true,
      );
    });
    it("Rejette les UUIDs mal formés", () => {
      expect(UUID_REGEX.test("not-a-uuid")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716")).toBe(false);
      expect(UUID_REGEX.test("550e8400e29b41d4a716446655440000")).toBe(false);
      expect(UUID_REGEX.test("")).toBe(false);
    });
    it("Rejette les UUIDs avec caractères invalides", () => {
      expect(UUID_REGEX.test("gggggggg-gggg-gggg-gggg-gggggggggggg")).toBe(
        false,
      );
    });
  });

  describe("ALPHA_REGEX", () => {
    it("Valide les chaînes alphabétiques ASCII", () => {
      expect(ALPHA_REGEX.test("Hello")).toBe(true);
      expect(ALPHA_REGEX.test("bonjour")).toBe(true);
    });
    it("Valide les caractères accentués", () => {
      expect(ALPHA_REGEX.test("Éric")).toBe(true);
      expect(ALPHA_REGEX.test("àéîôùç")).toBe(true);
    });
    it("Rejette les chiffres", () => {
      expect(ALPHA_REGEX.test("hello2")).toBe(false);
      expect(ALPHA_REGEX.test("123")).toBe(false);
    });
    it("Rejette les espaces et caractères spéciaux", () => {
      expect(ALPHA_REGEX.test("hello world")).toBe(false);
      expect(ALPHA_REGEX.test("hello!")).toBe(false);
    });
    it("Rejette une chaîne vide", () => {
      expect(ALPHA_REGEX.test("")).toBe(false);
    });
  });

  describe("HEXA_REGEX", () => {
    it("Valide les couleurs hex longues avec #", () => {
      expect(HEXA_REGEX.test("#FF5733")).toBe(true);
      expect(HEXA_REGEX.test("#000000")).toBe(true);
    });
    it("Valide les couleurs hex longues sans #", () => {
      expect(HEXA_REGEX.test("FF5733")).toBe(true);
    });
    it("Valide les couleurs hex courtes avec #", () => {
      expect(HEXA_REGEX.test("#fff")).toBe(true);
      expect(HEXA_REGEX.test("#abc")).toBe(true);
    });
    it("Valide les couleurs hex courtes sans #", () => {
      expect(HEXA_REGEX.test("fff")).toBe(true);
    });
    it("Est insensible à la casse", () => {
      expect(HEXA_REGEX.test("#ff5733")).toBe(true);
      expect(HEXA_REGEX.test("#FF5733")).toBe(true);
    });
    it("Rejette les valeurs invalides", () => {
      expect(HEXA_REGEX.test("red")).toBe(false);
      expect(HEXA_REGEX.test("#gggggg")).toBe(false);
      expect(HEXA_REGEX.test("#12345")).toBe(false); // 5 caractères
      expect(HEXA_REGEX.test("")).toBe(false);
    });
    it("Rejette les hex à 4 ou 5 caractères", () => {
      expect(HEXA_REGEX.test("#1234")).toBe(false);
      expect(HEXA_REGEX.test("#12345")).toBe(false);
    });
  });
});
