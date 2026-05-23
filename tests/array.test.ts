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
} from "../lib/array";
import { Uint } from "../lib/brandedproxy";
import { UI_TEN, UI_ZERO } from "../lib/constants";

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
});
