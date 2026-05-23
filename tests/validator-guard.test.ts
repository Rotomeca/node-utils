import { describe, it, expect } from 'vitest';
import { isEmail, isURL, isUUID, isNumeric, isAlpha, isHexColor } from '../lib/validator';
import {
  isNonEmptyString, isArrayLike, isNonEmptyArray,
  isObject, isDefined, isNullOrUndefined,
} from '../lib/guard';

describe('validator', () => {

  // ── isEmail ─────────────────────────────────────────────────
  describe('isEmail', () => {
    it('valide un email correct', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('first.last+tag@sub.domain.fr')).toBe(true);
    });
    it('rejette les emails invalides', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('a@b')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail('')).toBe(false);
    });
  });

  // ── isURL ───────────────────────────────────────────────────
  describe('isURL', () => {
    it('valide les URLs avec protocole', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://sub.domain.io/path?q=1')).toBe(true);
      expect(isURL('ftp://files.io')).toBe(true);
    });
    it('rejette les URLs sans protocole', () => {
      expect(isURL('example.com')).toBe(false);
      expect(isURL('not a url')).toBe(false);
      expect(isURL('')).toBe(false);
    });
  });

  // ── isUUID ──────────────────────────────────────────────────
  describe('isUUID', () => {
    it('valide un UUID v4', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });
    it('est insensible à la casse', () => {
      expect(isUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });
    it('rejette les non-UUIDs', () => {
      expect(isUUID('not-a-uuid')).toBe(false);
      expect(isUUID('123')).toBe(false);
      expect(isUUID('')).toBe(false);
    });
  });

  // ── isNumeric ───────────────────────────────────────────────
  describe('isNumeric', () => {
    it('valide les entiers', () => {
      expect(isNumeric('42')).toBe(true);
      expect(isNumeric('-7')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });
    it('valide les flottants', () => {
      expect(isNumeric('3.14')).toBe(true);
      expect(isNumeric('-0.5')).toBe(true);
    });
    it('rejette les non-numériques', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('')).toBe(false);
      expect(isNumeric('  ')).toBe(false);
      expect(isNumeric('12abc')).toBe(false);
    });
  });

  // ── isAlpha ─────────────────────────────────────────────────
  describe('isAlpha', () => {
    it('valide les chaînes alpha', () => {
      expect(isAlpha('Bonjour')).toBe(true);
      expect(isAlpha('Éric')).toBe(true);
    });
    it('rejette les chaînes avec chiffres ou espaces', () => {
      expect(isAlpha('hello2')).toBe(false);
      expect(isAlpha('hi there')).toBe(false);
      expect(isAlpha('')).toBe(false);
    });
  });

  // ── isHexColor ──────────────────────────────────────────────
  describe('isHexColor', () => {
    it('valide les couleurs hex longues', () => {
      expect(isHexColor('#FF5733')).toBe(true);
      expect(isHexColor('FF5733')).toBe(true);
    });
    it('valide les couleurs hex courtes', () => {
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('fff')).toBe(true);
    });
    it('est insensible à la casse', () => {
      expect(isHexColor('#ff5733')).toBe(true);
      expect(isHexColor('#FF5733')).toBe(true);
    });
    it('rejette les couleurs invalides', () => {
      expect(isHexColor('red')).toBe(false);
      expect(isHexColor('#gggggg')).toBe(false);
      expect(isHexColor('')).toBe(false);
    });
  });

});

describe('guard', () => {

  // ── isNonEmptyString ────────────────────────────────────────
  describe('isNonEmptyString', () => {
    it('valide une string non vide', () => {
      expect(isNonEmptyString('hello')).toBe(true);
    });
    it('rejette une string vide ou whitespace', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
    });
    it('rejette les non-strings', () => {
      expect(isNonEmptyString(42)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });

  // ── isArrayLike ─────────────────────────────────────────────
  describe('isArrayLike', () => {
    it('valide un tableau natif non vide', () => {
      expect(isArrayLike([1, 2, 3])).toBe(true);
    });
    it('valide un objet array-like', () => {
      expect(isArrayLike({ length: 2, 0: 'a', 1: 'b' })).toBe(true);
    });
    it('rejette un tableau vide (length - 1 = -1 non présent)', () => {
      expect(isArrayLike([])).toBe(false);
    });
    it('rejette null et undefined', () => {
      expect(isArrayLike(null)).toBe(false);
      expect(isArrayLike(undefined)).toBe(false);
    });
  });

  // ── isNonEmptyArray ─────────────────────────────────────────
  describe('isNonEmptyArray', () => {
    it('valide un tableau non vide', () => {
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    });
    it('rejette un tableau vide', () => {
      expect(isNonEmptyArray([])).toBe(false);
    });
    it('rejette les non-tableaux', () => {
      expect(isNonEmptyArray(null)).toBe(false);
      expect(isNonEmptyArray('abc')).toBe(false);
      expect(isNonEmptyArray({ length: 1 })).toBe(false);
    });
  });

  // ── isObject ────────────────────────────────────────────────
  describe('isObject', () => {
    it('valide un plain object', () => {
      expect(isObject({ a: 1 })).toBe(true);
    });
    it('rejette null', () => {
      expect(isObject(null)).toBe(false);
    });
    it('rejette les tableaux', () => {
      expect(isObject([1, 2])).toBe(false);
    });
    it('rejette les fonctions', () => {
      expect(isObject(() => {})).toBe(false);
    });
    it('rejette les primitifs', () => {
      expect(isObject(42)).toBe(false);
      expect(isObject('str')).toBe(false);
    });
  });

  // ── isDefined ───────────────────────────────────────────────
  describe('isDefined', () => {
    it('retourne true pour les valeurs définies', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
    });
    it('retourne false pour null et undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  // ── isNullOrUndefined ───────────────────────────────────────
  describe('isNullOrUndefined', () => {
    it('retourne true pour null et undefined', () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
    });
    it('retourne false pour les valeurs définies', () => {
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined('')).toBe(false);
    });
  });

});
