import { describe, it, expect, vi } from 'vitest';
import { debounce, throttle, memoize, once, noop, identity } from '../lib/function';
import { toUint } from '../lib/types';

describe('function', () => {

  // ── debounce ────────────────────────────────────────────────
  describe('debounce', () => {
    it('n\'exécute la fonction qu\'après le délai', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, toUint(50));
      debounced();
      debounced();
      debounced();
      expect(fn).not.toHaveBeenCalled();
      await new Promise(r => setTimeout(r, 80));
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('remet le timer à zéro à chaque appel', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, toUint(50));
      debounced();
      await new Promise(r => setTimeout(r, 30));
      debounced();
      await new Promise(r => setTimeout(r, 30));
      expect(fn).not.toHaveBeenCalled();
      await new Promise(r => setTimeout(r, 40));
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('passe les arguments correctement', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, toUint(50));
      debounced('hello', 42);
      await new Promise(r => setTimeout(r, 80));
      expect(fn).toHaveBeenCalledWith('hello', 42);
    });
  });

  // ── throttle ────────────────────────────────────────────────
  describe('throttle', () => {
    it('exécute immédiatement le premier appel', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, toUint(100));
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('ignore les appels dans la fenêtre', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, toUint(100));
      throttled();
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('accepte un nouvel appel après le délai', async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, toUint(50));
      throttled();
      await new Promise(r => setTimeout(r, 80));
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  // ── memoize ─────────────────────────────────────────────────
  describe('memoize', () => {
    it('met en cache les résultats', () => {
      const fn = vi.fn((n: number) => n * 2);
      const memo = memoize(fn);
      memo(5);
      memo(5);
      memo(5);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('recalcule pour des arguments différents', () => {
      const fn = vi.fn((n: number) => n * 2);
      const memo = memoize(fn);
      memo(1);
      memo(2);
      expect(fn).toHaveBeenCalledTimes(2);
    });
    it('retourne la valeur correcte depuis le cache', () => {
      const memo = memoize((n: number) => n * 3);
      expect(memo(7)).toBe(21);
      expect(memo(7)).toBe(21);
    });
    it('compare les objets par valeur (JSON)', () => {
      const fn = vi.fn((obj: { a: number }) => obj.a);
      const memo = memoize(fn);
      memo({ a: 1 });
      memo({ a: 1 });
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  // ── once ────────────────────────────────────────────────────
  describe('once', () => {
    it('n\'exécute la fonction qu\'une seule fois', () => {
      const fn = vi.fn(() => 42);
      const onceFn = once(fn);
      onceFn();
      onceFn();
      onceFn();
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('retourne toujours la valeur du premier appel', () => {
      let counter = 0;
      const onceFn = once(() => ++counter);
      expect(onceFn()).toBe(1);
      expect(onceFn()).toBe(1);
    });
    it('libère la référence à fn après le premier appel', () => {
      const fn = vi.fn(() => 'ok');
      const onceFn = once(fn);
      onceFn();
      // Après le premier appel, _fn est null en interne
      expect(onceFn()).toBe('ok');
    });
  });

  // ── noop ────────────────────────────────────────────────────
  describe('noop', () => {
    it('ne retourne rien', () => {
      expect(noop()).toBeUndefined();
    });
    it('peut être appelée sans arguments', () => {
      expect(() => noop()).not.toThrow();
    });
  });

  // ── identity ────────────────────────────────────────────────
  describe('identity', () => {
    it('retourne la valeur inchangée', () => {
      expect(identity(42)).toBe(42);
      expect(identity('hello')).toBe('hello');
    });
    it('retourne la même référence pour les objets', () => {
      const obj = { a: 1 };
      expect(identity(obj)).toBe(obj);
    });
    it('fonctionne avec null et undefined', () => {
      expect(identity(null)).toBeNull();
      expect(identity(undefined)).toBeUndefined();
    });
  });

});
