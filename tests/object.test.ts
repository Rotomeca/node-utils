import { describe, it, expect, vi } from "vitest";
import {
  pick,
  omit,
  deepClone,
  isEmpty,
  mapValues,
  mapKeys,
  flattenObject,
  unflattenObject,
  filterKeys,
  filterValues,
  invert,
} from "../lib/object";
import { isDefined } from "../lib/guard";

describe("object", () => {
  // ── pick ────────────────────────────────────────────────────
  describe("pick", () => {
    it("extrait les clés demandées", () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
    it("retourne un objet vide si keys est vide", () => {
      expect(pick({ a: 1 }, [])).toEqual({});
    });
    it("retourne un objet vide si obj est falsy", () => {
      expect(pick(null as any, ["a"])).toEqual({});
    });
    it("ne mute pas l'objet source", () => {
      const src = { a: 1, b: 2 };
      pick(src, ["a"]);
      expect(src).toEqual({ a: 1, b: 2 });
    });
  });

  // ── omit ────────────────────────────────────────────────────
  describe("omit", () => {
    it("exclut les clés listées", () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
    });
    it("retourne une copie si keys est vide", () => {
      expect(omit({ a: 1 }, [])).toEqual({ a: 1 });
    });
    it("retourne un objet vide si obj est falsy", () => {
      expect(omit(null as any, ["a"])).toEqual({});
    });
    it("ne mute pas l'objet source", () => {
      const src = { a: 1, b: 2 };
      omit(src, ["a"]);
      expect(src).toEqual({ a: 1, b: 2 });
    });
  });

  // ── deepClone ────────────────────────────────────────────────
  describe("deepClone", () => {
    it("crée une copie profonde", () => {
      const src = { a: { b: 1 } };
      const clone = deepClone(src);
      clone.a.b = 99;
      expect(src.a.b).toBe(1);
    });
    it("clone les tableaux imbriqués", () => {
      const src = { arr: [1, 2, 3] };
      const clone = deepClone(src);
      clone.arr.push(4);
      expect(src.arr).toHaveLength(3);
    });
    it("clone les types primitifs", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("hello")).toBe("hello");
    });
    it("clone un tableau de premier niveau", () => {
      const src = [1, 2, 3];
      const clone = deepClone(src);
      clone.push(4);
      expect(src).toHaveLength(3);
    });
  });

  // ── isEmpty ─────────────────────────────────────────────────
  describe("isEmpty", () => {
    it("retourne true pour un objet vide", () => {
      expect(isEmpty({})).toBe(true);
    });
    it("retourne false pour un objet avec propriétés", () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
    it("retourne false pour un objet avec propriété undefined", () => {
      expect(isEmpty({ a: undefined })).toBe(false);
    });
  });

  // ── mapValues ───────────────────────────────────────────────
  describe("mapValues", () => {
    it("transforme les valeurs", () => {
      expect(mapValues({ a: 1, b: 2 }, (x) => x * 2)).toEqual({ a: 2, b: 4 });
    });
    it("passe la clé en second argument", () => {
      const keys: string[] = [];
      mapValues({ a: 1, b: 2 }, (_, k) => {
        keys.push(k as string);
        return 0;
      });
      expect(keys.sort()).toEqual(["a", "b"]);
    });
    it("retourne un objet vide si entrée vide", () => {
      expect(mapValues({}, (x) => x)).toEqual({});
    });
    it("ne mute pas l'objet source", () => {
      const src = { a: 1 };
      mapValues(src, (x) => x * 2);
      expect(src).toEqual({ a: 1 });
    });
  });

  // ── mapKeys ─────────────────────────────────────────────────
  describe("mapKeys", () => {
    it("transforme les clés", () => {
      expect(
        mapKeys({ a: 1, b: 2 }, (k) => (k as string).toUpperCase()),
      ).toEqual({ A: 1, B: 2 });
    });
    it("passe la valeur en second argument", () => {
      const vals: number[] = [];
      mapKeys({ a: 1 }, (_, v) => {
        vals.push(v as number);
        return "x";
      });
      expect(vals).toEqual([1]);
    });
    it("retourne un objet vide si entrée vide", () => {
      expect(mapKeys({}, (k) => k as string)).toEqual({});
    });
  });
  describe("flattenObject", () => {
    it("Aplatit un objet imbriqué sur un niveau", () => {
      expect(flattenObject({ a: { b: 1 } })).toEqual({ "a.b": 1 });
    });

    it("Aplatit un objet imbriqué sur plusieurs niveaux", () => {
      expect(flattenObject({ a: { b: { c: 1 } } })).toEqual({ "a.b.c": 1 });
    });

    it("Conserve les propriétés de premier niveau", () => {
      expect(flattenObject({ a: 1, b: { c: 2 } })).toEqual({ a: 1, "b.c": 2 });
    });

    it("Utilise le séparateur personnalisé", () => {
      expect(flattenObject({ a: { b: 1 } }, "/")).toEqual({ "a/b": 1 });
    });

    it("Conserve les tableaux comme valeurs feuilles", () => {
      expect(flattenObject({ a: [1, 2], b: { c: 3 } })).toEqual({
        a: [1, 2],
        "b.c": 3,
      });
    });

    it("Conserve les instances de Date comme valeurs feuilles", () => {
      const d = new Date("2024-01-01");
      expect(flattenObject({ a: { d } })).toEqual({ "a.d": d });
    });

    it("Conserve les valeurs null comme valeurs feuilles", () => {
      expect(flattenObject({ a: { b: null } })).toEqual({ "a.b": null });
    });

    it("Retourne un objet vide pour un objet source vide", () => {
      expect(flattenObject({})).toEqual({});
    });

    it("Ne mute pas l'objet source", () => {
      const obj = { a: { b: 1 } };
      flattenObject(obj);
      expect(obj).toEqual({ a: { b: 1 } });
    });
  });
  describe("unflattenObject", () => {
    it("Reconstruit un objet imbriqué sur un niveau", () => {
      expect(unflattenObject({ "a.b": 1 })).toEqual({ a: { b: 1 } });
    });

    it("Reconstruit un objet imbriqué sur plusieurs niveaux", () => {
      expect(unflattenObject({ "a.b.c": 1 })).toEqual({ a: { b: { c: 1 } } });
    });

    it("Conserve les propriétés de premier niveau", () => {
      expect(unflattenObject({ a: 1, "b.c": 2 })).toEqual({
        a: 1,
        b: { c: 2 },
      });
    });

    it("Utilise le séparateur personnalisé", () => {
      expect(unflattenObject({ "a/b": 1 }, "/")).toEqual({ a: { b: 1 } });
    });

    it("Fusionne les clés partageant un même préfixe", () => {
      expect(unflattenObject({ "a.b": 1, "a.c": 2 })).toEqual({
        a: { b: 1, c: 2 },
      });
    });

    it("Retourne un objet vide pour un objet source vide", () => {
      expect(unflattenObject({})).toEqual({});
    });

    it("Ne mute pas l'objet source", () => {
      const obj = { "a.b": 1 };
      unflattenObject(obj);
      expect(obj).toEqual({ "a.b": 1 });
    });
  });
  describe("flattenObject / unflattenObject — aller-retour", () => {
    it("unflatten(flatten(obj)) === obj pour un objet simple", () => {
      const obj = { a: 1, b: { c: 2, d: 3 } };
      expect(unflattenObject(flattenObject(obj))).toEqual(obj);
    });

    it("unflatten(flatten(obj)) === obj pour un objet profond", () => {
      const obj = { a: { b: { c: { d: 42 } } }, x: 1 };
      expect(unflattenObject(flattenObject(obj))).toEqual(obj);
    });

    it("unflatten(flatten(obj)) === obj avec un séparateur custom", () => {
      const obj = { a: { b: 1 }, c: { d: { e: 2 } } };
      expect(unflattenObject(flattenObject(obj, "/"), "/")).toEqual(obj);
    });
  });
  describe("filterKeys", () => {
    it("Retourne les clés pour lesquelles le prédicat est vrai", () => {
      expect(filterKeys({ a: 1, b: 2, c: 3 }, (key) => key !== "b")).toEqual({
        a: 1,
        c: 3,
      });
    });

    it("Retourne un objet vide si aucune clé ne satisfait le prédicat", () => {
      expect(filterKeys({ a: 1, b: 2 }, () => false)).toEqual({});
    });

    it("Retourne toutes les clés si toutes satisfont le prédicat", () => {
      expect(filterKeys({ a: 1, b: 2 }, () => true)).toEqual({ a: 1, b: 2 });
    });

    it("Retourne un objet vide si l'objet source est vide", () => {
      expect(filterKeys({}, () => true)).toEqual({});
    });

    it("Filtre les clés commençant par un underscore", () => {
      expect(
        filterKeys(
          { name: "Alice", _id: 1, age: 30 },
          (key) => !String(key).startsWith("_"),
        ),
      ).toEqual({ name: "Alice", age: 30 });
    });

    it("Filtre sur une liste de clés autorisées", () => {
      const allowed = new Set(["a", "c"]);
      expect(
        filterKeys({ a: 1, b: 2, c: 3 }, (key) => allowed.has(String(key))),
      ).toEqual({ a: 1, c: 3 });
    });

    it("Ne mute pas l'objet source", () => {
      const obj = { a: 1, b: 2, c: 3 };
      filterKeys(obj, (key) => key !== "b");
      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("Retourne un objet distinct de l'objet source", () => {
      const obj = { a: 1, b: 2 };
      expect(filterKeys(obj, () => true)).not.toBe(obj);
    });
  });
  describe("filterValues", () => {
    it("Retourne les entrées dont la valeur satisfait le prédicat", () => {
      expect(filterValues({ a: 1, b: 0, c: 3 }, (v) => v > 0)).toEqual({
        a: 1,
        c: 3,
      });
    });

    it("Retourne un objet vide si aucune valeur ne satisfait le prédicat", () => {
      expect(filterValues({ a: 1, b: 2 }, () => false)).toEqual({});
    });

    it("Retourne toutes les entrées si toutes les valeurs satisfont le prédicat", () => {
      expect(filterValues({ a: 1, b: 2 }, () => true)).toEqual({ a: 1, b: 2 });
    });

    it("Retourne un objet vide si l'objet source est vide", () => {
      expect(filterValues({}, () => true)).toEqual({});
    });

    it("Filtre les valeurs nulles et undefined via isDefined", () => {
      expect(
        filterValues({ a: 1, b: null, c: "hello", d: undefined }, isDefined),
      ).toEqual({ a: 1, c: "hello" });
    });

    it("Filtre les valeurs de type string", () => {
      expect(
        filterValues(
          { a: 1, b: "hello", c: 2, d: "world" },
          (v) => typeof v === "string",
        ),
      ).toEqual({ b: "hello", d: "world" });
    });

    it("Ne mute pas l'objet source", () => {
      const obj = { a: 1, b: 2, c: 3 };
      filterValues(obj, (v) => v > 1);
      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("Retourne un objet distinct de l'objet source", () => {
      const obj = { a: 1, b: 2 };
      expect(filterValues(obj, () => true)).not.toBe(obj);
    });
  });
  describe("invert", () => {
    it("Inverse les clés et les valeurs", () => {
      expect(invert({ a: "x", b: "y", c: "z" })).toEqual({
        x: "a",
        y: "b",
        z: "c",
      });
    });

    it("Retourne un objet vide si l'objet source est vide", () => {
      expect(invert({} as Record<string, string>)).toEqual({});
    });

    it("Fonctionne avec un seul élément", () => {
      expect(invert({ fr: "Bonjour" })).toEqual({ Bonjour: "fr" });
    });

    it("Produit un objet de type Record<V, K> inversable", () => {
      const original = { a: "x", b: "y" };
      const inverted = invert(original);
      expect(invert(inverted)).toEqual(original);
    });

    it("La dernière clé l'emporte en cas de valeurs dupliquées", () => {
      const result = invert({ a: "x", b: "x" });
      expect(result["x"]).toBe("b");
    });

    it("Ne mute pas l'objet source", () => {
      const obj = { a: "x", b: "y" };
      invert(obj);
      expect(obj).toEqual({ a: "x", b: "y" });
    });

    it("Retourne un objet distinct de l'objet source", () => {
      const obj = { a: "x" };
      expect(invert(obj)).not.toBe(obj);
    });
  });
});
