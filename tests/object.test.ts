import { describe, it, expect, vi } from 'vitest';
import { pick, omit, deepClone, isEmpty, mapValues, mapKeys } from '../lib/object';

describe('object', () => {

  // ── pick ────────────────────────────────────────────────────
  describe('pick', () => {
    it('extrait les clés demandées', () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
    it('retourne un objet vide si keys est vide', () => {
      expect(pick({ a: 1 }, [])).toEqual({});
    });
    it('retourne un objet vide si obj est falsy', () => {
      expect(pick(null as any, ['a'])).toEqual({});
    });
    it('ne mute pas l\'objet source', () => {
      const src = { a: 1, b: 2 };
      pick(src, ['a']);
      expect(src).toEqual({ a: 1, b: 2 });
    });
  });

  // ── omit ────────────────────────────────────────────────────
  describe('omit', () => {
    it('exclut les clés listées', () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
    });
    it('retourne une copie si keys est vide', () => {
      expect(omit({ a: 1 }, [])).toEqual({ a: 1 });
    });
    it('retourne un objet vide si obj est falsy', () => {
      expect(omit(null as any, ['a'])).toEqual({});
    });
    it('ne mute pas l\'objet source', () => {
      const src = { a: 1, b: 2 };
      omit(src, ['a']);
      expect(src).toEqual({ a: 1, b: 2 });
    });
  });

  // ── deepClone ────────────────────────────────────────────────
  describe('deepClone', () => {
    it('crée une copie profonde', () => {
      const src = { a: { b: 1 } };
      const clone = deepClone(src);
      clone.a.b = 99;
      expect(src.a.b).toBe(1);
    });
    it('clone les tableaux imbriqués', () => {
      const src = { arr: [1, 2, 3] };
      const clone = deepClone(src);
      clone.arr.push(4);
      expect(src.arr).toHaveLength(3);
    });
    it('clone les types primitifs', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
    });
    it('clone un tableau de premier niveau', () => {
      const src = [1, 2, 3];
      const clone = deepClone(src);
      clone.push(4);
      expect(src).toHaveLength(3);
    });
  });

  // ── isEmpty ─────────────────────────────────────────────────
  describe('isEmpty', () => {
    it('retourne true pour un objet vide', () => {
      expect(isEmpty({})).toBe(true);
    });
    it('retourne false pour un objet avec propriétés', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
    it('retourne false pour un objet avec propriété undefined', () => {
      expect(isEmpty({ a: undefined })).toBe(false);
    });
  });

  // ── mapValues ───────────────────────────────────────────────
  describe('mapValues', () => {
    it('transforme les valeurs', () => {
      expect(mapValues({ a: 1, b: 2 }, x => x * 2)).toEqual({ a: 2, b: 4 });
    });
    it('passe la clé en second argument', () => {
      const keys: string[] = [];
      mapValues({ a: 1, b: 2 }, (_, k) => { keys.push(k as string); return 0; });
      expect(keys.sort()).toEqual(['a', 'b']);
    });
    it('retourne un objet vide si entrée vide', () => {
      expect(mapValues({}, x => x)).toEqual({});
    });
    it('ne mute pas l\'objet source', () => {
      const src = { a: 1 };
      mapValues(src, x => x * 2);
      expect(src).toEqual({ a: 1 });
    });
  });

  // ── mapKeys ─────────────────────────────────────────────────
  describe('mapKeys', () => {
    it('transforme les clés', () => {
      expect(mapKeys({ a: 1, b: 2 }, k => (k as string).toUpperCase())).toEqual({ A: 1, B: 2 });
    });
    it('passe la valeur en second argument', () => {
      const vals: number[] = [];
      mapKeys({ a: 1 }, (_, v) => { vals.push(v as number); return 'x'; });
      expect(vals).toEqual([1]);
    });
    it('retourne un objet vide si entrée vide', () => {
      expect(mapKeys({}, k => k as string)).toEqual({});
    });
  });

});
