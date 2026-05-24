import { describe, it, expect } from 'vitest';
import { clamp, roundTo, isInRange, average } from '../lib/number';
import { pipe } from '../lib/pipe';
import { toInt, toUint, toFloat, toUfloat } from '../lib/types';

describe('number', () => {

  // ── clamp ───────────────────────────────────────────────────
  describe('clamp', () => {
    it('retourne la valeur si dans l\'intervalle', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
    it('retourne min si en dessous', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });
    it('retourne max si au dessus', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
    it('fonctionne avec des bornes égales', () => {
      expect(clamp(5, 5, 5)).toBe(5);
    });
    it('fonctionne sur les bornes exactes', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  // ── roundTo ─────────────────────────────────────────────────
  describe('roundTo', () => {
    it('arrondit au nombre de décimales demandé', () => {
      expect(roundTo(toFloat(3.14159), toUint(2))).toBeCloseTo(3.14);
    });
    it('arrondit à 0 décimale', () => {
      expect(roundTo(toFloat(3.7), toUint(0))).toBe(4);
    });
    it('gère les nombres négatifs', () => {
      expect(roundTo(toFloat(-2.555), toUint(2))).toBeCloseTo(-2.56, 1);
    });
  });

  // ── isInRange ───────────────────────────────────────────────
  describe('isInRange', () => {
    it('retourne true si dans l\'intervalle (bornes incluses)', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });
    it('retourne false si hors intervalle', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });

  // ── average ─────────────────────────────────────────────────
  describe('average', () => {
    it('calcule la moyenne correcte', () => {
      expect(average([1, 2, 3, 4])).toBe(2.5);
    });
    it('retourne 0 pour un tableau vide', () => {
      expect(average([])).toBe(0);
    });
    it('fonctionne avec un seul élément', () => {
      expect(average([42])).toBe(42);
    });
    it('gère les nombres négatifs', () => {
      expect(average([-10, 10])).toBe(0);
    });
  });

});

describe('pipe', () => {
  it('applique une fonction', () => {
    expect(pipe(5, x => x * 2)).toBe(10);
  });
  it('chaîne deux fonctions', () => {
    expect(pipe(5, x => x * 2, x => x + 1)).toBe(11);
  });
  it('chaîne trois fonctions', () => {
    expect(pipe('hello', s => s.toUpperCase(), s => s + '!', s => s.length)).toBe(6);
  });
  it('fonctionne avec identity', () => {
    expect(pipe(42, x => x)).toBe(42);
  });
  it('propage correctement les types', () => {
    const result: string = pipe(42, n => n.toString(), s => s + '!');
    expect(result).toBe('42!');
  });
  it('chaîne jusqu\'à 10 fonctions', () => {
    const result = pipe(
      0,
      x => x + 1, x => x + 1, x => x + 1, x => x + 1, x => x + 1,
      x => x + 1, x => x + 1, x => x + 1, x => x + 1, x => x + 1,
    );
    expect(result).toBe(10);
  });
});

describe('types — branded constructors', () => {

  describe('toInt', () => {
    it('convertit un entier valide', () => {
      expect(toInt(42)).toBe(42);
    });
    it('lève une erreur pour un flottant', () => {
      expect(() => toInt(3.14)).toThrow();
    });
  });

  describe('toUint', () => {
    it('convertit un entier positif valide', () => {
      expect(toUint(10)).toBe(10);
    });
    it('lève une erreur pour un entier négatif', () => {
      expect(() => toUint(-1)).toThrow();
    });
    it('lève une erreur pour un flottant', () => {
      expect(() => toUint(1.5)).toThrow();
    });
  });

  describe('toFloat', () => {
    it('convertit un nombre fini', () => {
      expect(toFloat(3.14)).toBeCloseTo(3.14);
    });
    it('lève une erreur pour Infinity', () => {
      expect(() => toFloat(Infinity)).toThrow();
    });
    it('lève une erreur pour NaN', () => {
      expect(() => toFloat(NaN)).toThrow();
    });
  });

  describe('toUfloat', () => {
    it('convertit un nombre fini positif', () => {
      expect(toUfloat(1.5)).toBeCloseTo(1.5);
    });
    it('lève une erreur pour un nombre négatif', () => {
      expect(() => toUfloat(-1)).toThrow();
    });
  });

});
