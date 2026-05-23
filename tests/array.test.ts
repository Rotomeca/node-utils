import { describe, it, expect, vi } from "vitest";
import {
  chunk,
  unique,
  uniqueBy,
  groupBy,
  first,
  last,
  sum,
  sortBy,
  flatten,
  flattenDeep,
  compact,
  partition,
  partitionToObject,
  intersection,
  difference,
  union,
  zip,
  take,
  drop,
  shuffle,
  maxBy,
  minBy,
} from "../lib/array";
import { Uint } from "../lib/brandedproxy";
import { UI_TEN, UI_ZERO } from "../lib/constants";
import { toUint } from "../lib/types";

describe("array", () => {
  // ── chunk ───────────────────────────────────────────────────
  describe("chunk", () => {
    it("découpe un tableau en sous-tableaux de taille donnée", () => {
      expect(chunk([1, 2, 3, 4, 5], Uint[2])).toEqual([[1, 2], [3, 4], [5]]);
    });
    it("retourne un tableau vide si le tableau source est vide", () => {
      expect(chunk([], Uint[2])).toEqual([]);
    });
    it("retourne un tableau vide si size <= 0", () => {
      expect(chunk([1, 2, 3], UI_ZERO)).toEqual([]);
    });
    it("retourne un seul chunk si size >= longueur", () => {
      expect(chunk([1, 2], UI_TEN)).toEqual([[1, 2]]);
    });
    it("fonctionne avec des objets", () => {
      const result = chunk([{ a: 1 }, { a: 2 }, { a: 3 }], Uint[2]);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
    });
  });

  // ── unique ──────────────────────────────────────────────────
  describe("unique", () => {
    it("supprime les doublons", () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });
    it("préserve l'ordre d'apparition", () => {
      expect(unique([3, 1, 2, 1])).toEqual([3, 1, 2]);
    });
    it("fonctionne avec des strings", () => {
      expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
    });
    it("retourne un tableau vide si entrée vide", () => {
      expect(unique([])).toEqual([]);
    });
    it("ne mute pas le tableau original", () => {
      const arr = [1, 2, 2];
      unique(arr);
      expect(arr).toEqual([1, 2, 2]);
    });
  });

  // ── uniqueBy ────────────────────────────────────────────────
  describe("uniqueBy", () => {
    it("déduplique par clé de projection", () => {
      const result = uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (x) => x.id);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
    it("conserve le premier élément rencontré", () => {
      const result = uniqueBy(
        [
          { id: 1, v: "a" },
          { id: 1, v: "b" },
        ],
        (x) => x.id,
      );
      expect(result[0].v).toBe("a");
    });
    it("retourne un tableau vide si entrée vide", () => {
      expect(uniqueBy([], (x) => x)).toEqual([]);
    });
  });

  // ── groupBy ─────────────────────────────────────────────────
  describe("groupBy", () => {
    it("regroupe les éléments par clé", () => {
      const result = groupBy(["alice", "albert", "bob"], (s) => s[0]);
      expect(result).toEqual({ a: ["alice", "albert"], b: ["bob"] });
    });
    it("retourne un objet vide si tableau vide", () => {
      expect(groupBy([], (x) => x)).toEqual({});
    });
    it("crée une clé par groupe unique", () => {
      const result = groupBy([1, 2, 3, 4], (n) =>
        n % 2 === 0 ? "pair" : "impair",
      );
      expect(result["pair"]).toEqual([2, 4]);
      expect(result["impair"]).toEqual([1, 3]);
    });
  });

  // ── first ───────────────────────────────────────────────────
  describe("first", () => {
    it("retourne le premier élément", () => {
      expect(first([10, 20, 30])).toBe(10);
    });
    it("retourne null si tableau vide", () => {
      expect(first([])).toBeNull();
    });
    it("fonctionne avec des objets", () => {
      expect(first([{ a: 1 }])).toEqual({ a: 1 });
    });
  });

  // ── last ────────────────────────────────────────────────────
  describe("last", () => {
    it("retourne le dernier élément", () => {
      expect(last([10, 20, 30])).toBe(30);
    });
    it("retourne null si tableau vide", () => {
      expect(last([])).toBeNull();
    });
    it("fonctionne avec un seul élément", () => {
      expect(last([42])).toBe(42);
    });
  });

  // ── sum ─────────────────────────────────────────────────────
  describe("sum", () => {
    it("calcule la somme d'un tableau", () => {
      expect(sum([1, 2, 3, 4])).toBe(10);
    });
    it("retourne 0 pour un tableau vide", () => {
      expect(sum([])).toBe(0);
    });
    it("gère les nombres négatifs", () => {
      expect(sum([-1, 1, -2, 2])).toBe(0);
    });
    it("gère les flottants", () => {
      expect(sum([0.1, 0.2])).toBeCloseTo(0.3);
    });
  });

  // ── sortBy ──────────────────────────────────────────────────
  describe("sortBy", () => {
    it("trie par nombre croissant", () => {
      const users = [{ id: 3 }, { id: 1 }, { id: 2 }];
      expect(sortBy(users, (u) => u.id)).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
    });
    it("trie par string (localeCompare)", () => {
      const names = [{ n: "Zoe" }, { n: "Alice" }, { n: "Éric" }];
      const result = sortBy(names, (u) => u.n).map((x) => x.n);
      expect(result).toEqual(["Alice", "Éric", "Zoe"]);
    });
    it("ne mute pas le tableau original", () => {
      const arr = [{ id: 3 }, { id: 1 }];
      sortBy(arr, (x) => x.id);
      expect(arr[0].id).toBe(3);
    });
    it("retourne un tableau vide si entrée vide", () => {
      expect(sortBy([], (x) => x)).toEqual([]);
    });
    it("n'appelle fn qu'une fois par élément (Schwartz transform)", () => {
      let callCount = 0;
      const arr = [3, 1, 2];
      sortBy(arr, (n) => {
        callCount++;
        return n;
      });
      expect(callCount).toBe(3);
    });
  });

  // ── flatten ──────────────────────────────────────────────────
  describe("flatten", () => {
    it("Applatit un tableau", () => {
      const result = flatten([[1, 2], [3, 4], [5]]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
    it("Applatit seulement un niveau du tableau", () => {
      const result = flatten([[1, [2, 3]], [4]]);
      expect(result).toEqual([1, [2, 3], 4]);
    });
    it("Fonctionne sur un tableau vide", () => {
      const result = flatten([]);
      expect(result).toEqual([]);
    });
    it("Fonctionne avec des sous-tableaux vides", () => {
      const result = flatten([[], [1, 2], []]);
      expect(result).toEqual([1, 2]);
    });
    it("Fonctionne avec un seul sous-tableau", () => {
      const result = flatten([[1, 2, 3]]);
      expect(result).toEqual([1, 2, 3]);
    });
    it("Préserve l'ordre des éléments", () => {
      const result = flatten([
        [3, 1],
        [4, 1],
        [5, 9],
      ]);
      expect(result).toEqual([3, 1, 4, 1, 5, 9]);
    });
    it("Ne mute pas le tableau original", () => {
      const arr = [
        [1, 2],
        [3, 4],
      ];
      const original = arr.map((sub) => [...sub]);
      flatten(arr);
      expect(arr).toEqual(original);
    });
    it("Retourne un nouveau tableau, pas une référence à l'original", () => {
      const arr = [
        [1, 2],
        [3, 4],
      ];
      const result = flatten(arr);
      expect(result).not.toBe(arr);
    });
    it("Fonctionne avec des strings", () => {
      const result = flatten([["a", "b"], ["c"]]);
      expect(result).toEqual(["a", "b", "c"]);
    });
  });

  // ── flattenDeep ──────────────────────────────────────────────
  describe("flattenDeep", () => {
    it("Applatit un tableau imbriqué sur tous les niveaux", () => {
      const result = flattenDeep<number>([1, [2, [3, [4]]]]);
      expect(result).toEqual([1, 2, 3, 4]);
    });
    it("Applatit plusieurs niveaux d'imbrication", () => {
      const result = flattenDeep<number>([1, [2], [[3], [4]]]);
      expect(result).toEqual([1, 2, 3, 4]);
    });
    it("Fonctionne sur un tableau vide", () => {
      const result = flattenDeep([]);
      expect(result).toEqual([]);
    });
    it("Fonctionne sur un tableau déjà plat", () => {
      const result = flattenDeep<number>([1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
    it("Fonctionne avec des strings", () => {
      const result = flattenDeep<string>([["a", ["b"]], [["c"]]]);
      expect(result).toEqual(["a", "b", "c"]);
    });
    it("Préserve l'ordre des éléments", () => {
      const result = flattenDeep<number>([
        [3, 1],
        [4, 1],
        [5, 9],
      ]);
      expect(result).toEqual([3, 1, 4, 1, 5, 9]);
    });
    it("Ne mute pas le tableau original", () => {
      const arr = [1, [2, [3]]];
      const original = JSON.stringify(arr);
      flattenDeep(arr);
      expect(JSON.stringify(arr)).toBe(original);
    });
    it("Retourne un nouveau tableau, pas une référence à l'original", () => {
      const arr = [1, 2, 3];
      const result = flattenDeep<number>(arr);
      expect(result).not.toBe(arr);
    });
    it("Prédicat appelé une fois par élément feuille", () => {
      let count = 0;
      const arr = [
        [1, 2],
        [3, [4, 5]],
      ];
      const result = flattenDeep<number>(arr);
      result.forEach(() => count++);
      expect(count).toBe(5);
    });
  });

  // ── compact ──────────────────────────────────────────────────
  describe("compact", () => {
    it("Supprime les valeurs null et undefined", () => {
      const result = compact([1, null, 2, undefined, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
    it("Supprime les strings vides", () => {
      const result = compact(["a", "", "b", null]);
      expect(result).toEqual(["a", "b"]);
    });
    it("Supprime les zéros et false", () => {
      const result = compact<number>([0, 1, false, 2, null, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
    it("Fonctionne sur un tableau vide", () => {
      const result = compact([]);
      expect(result).toEqual([]);
    });
    it("Retourne le tableau intact s'il n'y a aucune valeur falsy", () => {
      const result = compact([1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
    it("Retourne un tableau vide si toutes les valeurs sont falsy", () => {
      const result = compact([null, undefined, false, 0, ""]);
      expect(result).toEqual([]);
    });
    it("Préserve l'ordre des éléments conservés", () => {
      const result = compact([3, null, 1, undefined, 4, null, 1]);
      expect(result).toEqual([3, 1, 4, 1]);
    });
    it("Ne mute pas le tableau original", () => {
      const arr = [1, null, 2, undefined, 3];
      const original = [...arr];
      compact(arr);
      expect(arr).toEqual(original);
    });
    it("Retourne un nouveau tableau, pas une référence à l'original", () => {
      const arr = [1, 2, 3];
      const result = compact(arr);
      expect(result).not.toBe(arr);
    });
    it("Préserve les objets et tableaux (truthy)", () => {
      const obj = { a: 1 };
      const arr = [obj, null, []];
      const result = compact(arr);
      expect(result[0]).toBe(obj);
      expect(result[1]).toEqual([]);
    });
  });

  // ── partition ────────────────────────────────────────────────
  describe("partition", () => {
    it("Sépare les pairs des impairs", () => {
      const result = partition([1, 2, 3, 4, 5], (x) => x % 2 === 0);
      expect(result).toEqual([
        [2, 4],
        [1, 3, 5],
      ]);
    });
    it("Sépare selon une condition sur des strings", () => {
      const result = partition(["alice", "bob", "anna"], (s) =>
        s.startsWith("a"),
      );
      expect(result).toEqual([["alice", "anna"], ["bob"]]);
    });
    it("Fonctionne sur un tableau vide", () => {
      const result = partition([], (x) => x > 0);
      expect(result).toEqual([[], []]);
    });
    it("Tous les éléments dans pass si tous satisfont le prédicat", () => {
      const result = partition([2, 4, 6], (x) => x % 2 === 0);
      expect(result).toEqual([[2, 4, 6], []]);
    });
    it("Tous les éléments dans fail si aucun ne satisfait le prédicat", () => {
      const result = partition([1, 3, 5], (x) => x % 2 === 0);
      expect(result).toEqual([[], [1, 3, 5]]);
    });
    it("Préserve l'ordre relatif dans chaque sous-tableau", () => {
      const result = partition([5, 1, 4, 2, 3], (x) => x > 3);
      expect(result[0]).toEqual([5, 4]);
      expect(result[1]).toEqual([1, 2, 3]);
    });
    it("Ne mute pas le tableau original", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      partition(arr, (x) => x % 2 === 0);
      expect(arr).toEqual(original);
    });
    it("Retourne deux nouveaux tableaux, pas des références à l'original", () => {
      const arr = [1, 2, 3];
      const [pass, fail] = partition(arr, (x) => x > 1);
      expect(pass).not.toBe(arr);
      expect(fail).not.toBe(arr);
    });
    it("La somme des longueurs des sous-tableaux est égale à la longueur du tableau original", () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const [pass, fail] = partition(arr, (x) => x % 2 === 0);
      expect(pass.length + fail.length).toBe(arr.length);
    });
    it("Le prédicat est appelé exactement une fois par élément", () => {
      const predicate = vi.fn((x: number) => x % 2 === 0);
      const arr = [1, 2, 3, 4];
      partition(arr, predicate);
      expect(predicate).toHaveBeenCalledTimes(arr.length);
    });
    it("Fonctionne avec des objets", () => {
      const users = [
        { name: "Alice", active: true },
        { name: "Bob", active: false },
      ];
      const [active, inactive] = partition(users, (u) => u.active);
      expect(active).toEqual([{ name: "Alice", active: true }]);
      expect(inactive).toEqual([{ name: "Bob", active: false }]);
    });
  });

  // ── partitionToObject ────────────────────────────────────────
  describe("partitionToObject", () => {
    it("Retourne un objet { pass, fail } avec les bons éléments", () => {
      const result = partitionToObject([1, 2, 3, 4, 5], (x) => x % 2 === 0);
      expect(result).toEqual({ pass: [2, 4], fail: [1, 3, 5] });
    });
    it("Fonctionne sur des strings", () => {
      const result = partitionToObject(["alice", "bob", "anna"], (s) =>
        s.startsWith("a"),
      );
      expect(result.pass).toEqual(["alice", "anna"]);
      expect(result.fail).toEqual(["bob"]);
    });
    it("Fonctionne sur un tableau vide", () => {
      const result = partitionToObject([], (x) => x > 0);
      expect(result).toEqual({ pass: [], fail: [] });
    });
    it("pass vide si aucun élément ne satisfait le prédicat", () => {
      const result = partitionToObject([1, 3, 5], (x) => x % 2 === 0);
      expect(result.pass).toEqual([]);
      expect(result.fail).toEqual([1, 3, 5]);
    });
    it("Le résultat est cohérent avec partition()", () => {
      const arr = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x > 3;
      const [pass, fail] = partition(arr, predicate);
      const obj = partitionToObject(arr, predicate);
      expect(obj.pass).toEqual(pass);
      expect(obj.fail).toEqual(fail);
    });
    it("Ne mute pas le tableau original", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      partitionToObject(arr, (x) => x % 2 === 0);
      expect(arr).toEqual(original);
    });
    it("La somme des longueurs pass + fail est égale à la longueur du tableau original", () => {
      const arr = [1, 2, 3, 4, 5, 6];
      const { pass, fail } = partitionToObject(arr, (x) => x > 3);
      expect(pass.length + fail.length).toBe(arr.length);
    });
    it("L'objet retourné contient bien les clés pass et fail", () => {
      const result = partitionToObject([1], (x) => x > 0);
      expect(result).toHaveProperty("pass");
      expect(result).toHaveProperty("fail");
    });
  });

  // ── intersection ────────────────────────────────────────
  describe("intersection", () => {
    it("Retourne les éléments communs aux deux tableaux", () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it("Retourne un tableau vide si aucun élément en commun", () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it("Retourne un tableau vide si le premier tableau est vide", () => {
      expect(intersection([], [1, 2, 3])).toEqual([]);
    });

    it("Retourne un tableau vide si le second tableau est vide", () => {
      expect(intersection([1, 2, 3], [])).toEqual([]);
    });

    it("Retourne un tableau vide si les deux tableaux sont vides", () => {
      expect(intersection([], [])).toEqual([]);
    });

    it("Déduplique les résultats quand a contient des doublons", () => {
      expect(intersection([1, 1, 2, 2], [1, 2])).toEqual([1, 2]);
    });

    it("Préserve l'ordre d'apparition dans a", () => {
      expect(intersection([3, 1, 2], [1, 2, 3])).toEqual([3, 1, 2]);
    });

    it("Fonctionne avec des tableaux de chaînes", () => {
      expect(intersection(["a", "b", "c"], ["b", "c", "d"])).toEqual([
        "b",
        "c",
      ]);
    });

    it("Fonctionne avec des tableaux d'objets par référence", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      expect(intersection([obj1, obj2], [obj2])).toEqual([obj2]);
    });

    it("Ne mute pas les tableaux d'origine", () => {
      const a = [1, 2, 3];
      const b = [2, 3, 4];
      const aCopy = [...a];
      const bCopy = [...b];
      intersection(a, b);
      expect(a).toEqual(aCopy);
      expect(b).toEqual(bCopy);
    });

    it("Retourne un nouveau tableau distinct des tableaux d'origine", () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      const result = intersection(a, b);
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
    });
  });

  // ── difference ────────────────────────────────────────
  describe("difference", () => {
    it("Retourne les éléments de a absents de b", () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });

    it("Retourne tous les éléments de a si b est vide", () => {
      expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    it("Retourne un tableau vide si a est vide", () => {
      expect(difference([], [1, 2, 3])).toEqual([]);
    });

    it("Retourne un tableau vide si tous les éléments de a sont dans b", () => {
      expect(difference([1, 2], [1, 2, 3])).toEqual([]);
    });

    it("Retourne un tableau vide si les deux tableaux sont vides", () => {
      expect(difference([], [])).toEqual([]);
    });

    it("Déduplique les résultats quand a contient des doublons", () => {
      expect(difference([1, 1, 2, 2], [2])).toEqual([1]);
    });

    it("Préserve l'ordre d'apparition dans a", () => {
      expect(difference([3, 1, 2], [2])).toEqual([3, 1]);
    });

    it("Fonctionne avec des tableaux de chaînes", () => {
      expect(difference(["a", "b", "c"], ["b"])).toEqual(["a", "c"]);
    });

    it("Fonctionne avec des tableaux d'objets par référence", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      expect(difference([obj1, obj2], [obj2])).toEqual([obj1]);
    });

    it("Ne mute pas les tableaux d'origine", () => {
      const a = [1, 2, 3];
      const b = [2, 3];
      const aCopy = [...a];
      const bCopy = [...b];
      difference(a, b);
      expect(a).toEqual(aCopy);
      expect(b).toEqual(bCopy);
    });

    it("Retourne un nouveau tableau distinct des tableaux d'origine", () => {
      const a = [1, 2, 3];
      const b = [3];
      const result = difference(a, b);
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
    });
  });

  // ── union ────────────────────────────────────────
  describe("union", () => {
    it("Retourne tous les éléments des deux tableaux sans doublons", () => {
      expect(union([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("Retourne les éléments de b si a est vide", () => {
      expect(union([], [1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("Retourne les éléments de a si b est vide", () => {
      expect(union([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    it("Retourne un tableau vide si les deux tableaux sont vides", () => {
      expect(union([], [])).toEqual([]);
    });

    it("Déduplique les doublons présents dans a seul", () => {
      expect(union([1, 1, 2], [3])).toEqual([1, 2, 3]);
    });

    it("Déduplique les doublons présents dans b seul", () => {
      expect(union([1], [2, 2, 3])).toEqual([1, 2, 3]);
    });

    it("Déduplique les éléments communs aux deux tableaux", () => {
      expect(union([1, 2], [2, 3])).toEqual([1, 2, 3]);
    });

    it("Préserve l'ordre : éléments de a en premier, puis nouveaux éléments de b", () => {
      expect(union([3, 1], [2, 1])).toEqual([3, 1, 2]);
    });

    it("Fonctionne avec des tableaux de chaînes", () => {
      expect(union(["a", "b"], ["b", "c"])).toEqual(["a", "b", "c"]);
    });

    it("Fonctionne avec des tableaux d'objets par référence", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      expect(union([obj1, obj2], [obj2, obj3])).toEqual([obj1, obj2, obj3]);
    });

    it("Ne mute pas les tableaux d'origine", () => {
      const a = [1, 2];
      const b = [3, 4];
      const aCopy = [...a];
      const bCopy = [...b];
      union(a, b);
      expect(a).toEqual(aCopy);
      expect(b).toEqual(bCopy);
    });

    it("Retourne un nouveau tableau distinct des tableaux d'origine", () => {
      const a = [1, 2];
      const b = [3, 4];
      const result = union(a, b);
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
    });
  });
  // ── zip ────────────────────────────────────────
  describe("zip", () => {
    it("Combine deux tableaux de même longueur en paires", () => {
      expect(zip([1, 2, 3], ["a", "b", "c"])).toEqual([
        [1, "a"],
        [2, "b"],
        [3, "c"],
      ]);
    });

    it("S'arrête au tableau le plus court quand a est plus long", () => {
      expect(zip([1, 2, 3], ["a", "b"])).toEqual([
        [1, "a"],
        [2, "b"],
      ]);
    });

    it("S'arrête au tableau le plus court quand b est plus long", () => {
      expect(zip([1, 2], ["a", "b", "c"])).toEqual([
        [1, "a"],
        [2, "b"],
      ]);
    });

    it("Retourne un tableau vide si a est vide", () => {
      expect(zip([], [1, 2, 3])).toEqual([]);
    });

    it("Retourne un tableau vide si b est vide", () => {
      expect(zip([1, 2, 3], [])).toEqual([]);
    });

    it("Retourne un tableau vide si les deux tableaux sont vides", () => {
      expect(zip([], [])).toEqual([]);
    });

    it("Fonctionne avec deux types différents", () => {
      expect(zip([true, false], [1, 0])).toEqual([
        [true, 1],
        [false, 0],
      ]);
    });

    it("Fonctionne avec des tableaux d'objets", () => {
      const a = [{ id: 1 }, { id: 2 }];
      const b = ["alice", "bob"];
      expect(zip(a, b)).toEqual([
        [{ id: 1 }, "alice"],
        [{ id: 2 }, "bob"],
      ]);
    });

    it("Ne mute pas les tableaux d'origine", () => {
      const a = [1, 2, 3];
      const b = ["a", "b", "c"];
      const aCopy = [...a];
      const bCopy = [...b];
      zip(a, b);
      expect(a).toEqual(aCopy);
      expect(b).toEqual(bCopy);
    });

    it("Retourne un nouveau tableau distinct des tableaux d'origine", () => {
      const a = [1, 2];
      const b = ["a", "b"];
      const result = zip(a, b);
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
    });
  });
  // ── take ────────────────────────────────────────
  describe("take", () => {
    it("Retourne les n premiers éléments", () => {
      expect(take([1, 2, 3, 4, 5], toUint(3))).toEqual([1, 2, 3]);
    });

    it("Retourne une copie complète si n >= longueur du tableau", () => {
      expect(take([1, 2, 3], toUint(5))).toEqual([1, 2, 3]);
    });

    it("Retourne une copie complète si n === longueur du tableau", () => {
      expect(take([1, 2, 3], toUint(3))).toEqual([1, 2, 3]);
    });

    it("Retourne un tableau vide si n === 0", () => {
      expect(take([1, 2, 3], toUint(0))).toEqual([]);
    });

    it("Retourne un tableau vide si le tableau source est vide", () => {
      expect(take([], toUint(3))).toEqual([]);
    });

    it("Fonctionne avec des tableaux de chaînes", () => {
      expect(take(["a", "b", "c", "d"], toUint(2))).toEqual(["a", "b"]);
    });

    it("Ne mute pas le tableau d'origine", () => {
      const arr = [1, 2, 3, 4];
      const copy = [...arr];
      take(arr, toUint(2));
      expect(arr).toEqual(copy);
    });

    it("Retourne un nouveau tableau distinct du tableau d'origine", () => {
      const arr = [1, 2, 3];
      expect(take(arr, toUint(3))).not.toBe(arr);
    });
  });
  // --- Drop -------------------------------------------
  describe("drop", () => {
    it("Retourne le tableau sans les n premiers éléments", () => {
      expect(drop([1, 2, 3, 4, 5], toUint(2))).toEqual([3, 4, 5]);
    });

    it("Retourne un tableau vide si n >= longueur du tableau", () => {
      expect(drop([1, 2, 3], toUint(5))).toEqual([]);
    });

    it("Retourne un tableau vide si n === longueur du tableau", () => {
      expect(drop([1, 2, 3], toUint(3))).toEqual([]);
    });

    it("Retourne une copie complète si n === 0", () => {
      expect(drop([1, 2, 3], toUint(0))).toEqual([1, 2, 3]);
    });

    it("Retourne un tableau vide si le tableau source est vide", () => {
      expect(drop([], toUint(3))).toEqual([]);
    });

    it("Fonctionne avec des tableaux de chaînes", () => {
      expect(drop(["a", "b", "c", "d"], toUint(2))).toEqual(["c", "d"]);
    });

    it("Ne mute pas le tableau d'origine", () => {
      const arr = [1, 2, 3, 4];
      const copy = [...arr];
      drop(arr, toUint(2));
      expect(arr).toEqual(copy);
    });

    it("Retourne un nouveau tableau distinct du tableau d'origine", () => {
      const arr = [1, 2, 3];
      expect(drop(arr, toUint(0))).not.toBe(arr);
    });
  });
  // ── Shuffle ────────────────────────────────────────
  describe("shuffle", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("Retourne un tableau contenant les mêmes éléments", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffle(arr).sort()).toEqual([...arr].sort());
    });

    it("Retourne un tableau de même longueur", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffle(arr)).toHaveLength(arr.length);
    });

    it("Retourne un tableau vide si le tableau source est vide", () => {
      expect(shuffle([])).toEqual([]);
    });

    it("Retourne un tableau d'un seul élément inchangé", () => {
      expect(shuffle([42])).toEqual([42]);
    });

    it("Ne mute pas le tableau d'origine", () => {
      const arr = [1, 2, 3, 4, 5];
      const copy = [...arr];
      shuffle(arr);
      expect(arr).toEqual(copy);
    });

    it("Retourne un nouveau tableau distinct du tableau d'origine", () => {
      const arr = [1, 2, 3];
      expect(shuffle(arr)).not.toBe(arr);
    });

    it("Applique correctement l'algorithme Fisher-Yates avec Math.random mocké", () => {
      // Math.random retourne toujours 0 → j vaut toujours 0 à chaque tour
      // Déroulé sur [1, 2, 3] :
      //   i=2 : j=0 → échange index 2 et 0 → [3, 2, 1]
      //   i=1 : j=0 → échange index 1 et 0 → [2, 3, 1]
      vi.spyOn(Math, "random").mockReturnValue(0);
      expect(shuffle([1, 2, 3])).toEqual([2, 3, 1]);
    });

    it("Ne permute pas quand Math.random retourne toujours la valeur maximale", () => {
      // Math.random retourne 0.999... → j vaut toujours i → aucun échange réel
      vi.spyOn(Math, "random").mockReturnValue(0.9999999999);
      const arr = [1, 2, 3, 4];
      expect(shuffle(arr)).toEqual([1, 2, 3, 4]);
    });

    it("Fonctionne avec des tableaux de chaînes", () => {
      const arr = ["a", "b", "c"];
      expect(shuffle(arr).sort()).toEqual([...arr].sort());
    });

    it("Fonctionne avec des tableaux d'objets", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const arr = [obj1, obj2, obj3];
      const result = shuffle(arr);
      expect(result).toHaveLength(3);
      expect(result).toContain(obj1);
      expect(result).toContain(obj2);
      expect(result).toContain(obj3);
    });
  });

  //── minBy ────────────────────────────────────────
  describe("minBy", () => {
    it("Retourne l'élément avec la valeur extraite la plus petite", () => {
      expect(minBy([{ n: 3 }, { n: 1 }, { n: 2 }], (x) => x.n)).toEqual({
        n: 1,
      });
    });

    it("Retourne null si le tableau est vide", () => {
      expect(minBy([], (x) => x as number)).toBeNull();
    });

    it("Retourne l'unique élément si le tableau en contient un seul", () => {
      expect(minBy([{ n: 5 }], (x) => x.n)).toEqual({ n: 5 });
    });

    it("Retourne le premier élément rencontré en cas d'égalité", () => {
      const a = { n: 1, label: "premier" };
      const b = { n: 1, label: "second" };
      expect(minBy([a, b], (x) => x.n)).toBe(a);
    });

    it("Fonctionne avec des valeurs négatives", () => {
      expect(minBy([{ n: -1 }, { n: -5 }, { n: -2 }], (x) => x.n)).toEqual({
        n: -5,
      });
    });

    it("Fonctionne avec une fonction d'extraction sur des nombres directs", () => {
      expect(minBy([3, 1, 4, 1, 5], (x) => x)).toBe(1);
    });

    it("Ne mute pas le tableau d'origine", () => {
      const arr = [{ n: 2 }, { n: 1 }];
      const copy = [...arr];
      minBy(arr, (x) => x.n);
      expect(arr).toEqual(copy);
    });
  });
  describe("maxBy", () => {
    it("Retourne l'élément avec la valeur extraite la plus grande", () => {
      expect(maxBy([{ n: 3 }, { n: 1 }, { n: 2 }], (x) => x.n)).toEqual({
        n: 3,
      });
    });

    it("Retourne null si le tableau est vide", () => {
      expect(maxBy([], (x) => x as number)).toBeNull();
    });

    it("Retourne l'unique élément si le tableau en contient un seul", () => {
      expect(maxBy([{ n: 5 }], (x) => x.n)).toEqual({ n: 5 });
    });

    it("Retourne le premier élément rencontré en cas d'égalité", () => {
      const a = { n: 9, label: "premier" };
      const b = { n: 9, label: "second" };
      expect(maxBy([a, b], (x) => x.n)).toBe(a);
    });

    it("Fonctionne avec des valeurs négatives", () => {
      expect(maxBy([{ n: -1 }, { n: -5 }, { n: -2 }], (x) => x.n)).toEqual({
        n: -1,
      });
    });

    it("Fonctionne avec une fonction d'extraction sur des nombres directs", () => {
      expect(maxBy([3, 1, 4, 1, 5], (x) => x)).toBe(5);
    });

    it("Ne mute pas le tableau d'origine", () => {
      const arr = [{ n: 2 }, { n: 1 }];
      const copy = [...arr];
      maxBy(arr, (x) => x.n);
      expect(arr).toEqual(copy);
    });
  });
});
