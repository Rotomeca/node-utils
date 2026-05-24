import { describe, it, expect, vi } from 'vitest';
import { sleep, retry, timeout, parallel, sequential } from '../lib/async';
import { toUint } from '../lib/types';

describe('async', () => {

  // ── sleep ───────────────────────────────────────────────────
  describe('sleep', () => {
    it('attend au moins la durée demandée', async () => {
      const start = Date.now();
      await sleep(toUint(50));
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });
    it('retourne une Promise', () => {
      expect(sleep(toUint(0))).toBeInstanceOf(Promise);
    });
  });

  // ── retry ───────────────────────────────────────────────────
  describe('retry', () => {
    it('retourne le résultat si la première tentative réussit', async () => {
      const fn = vi.fn().mockResolvedValue('ok');
      const result = await retry(fn, toUint(3), toUint(0));
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('réessaie jusqu\'au succès', async () => {
      let attempts = 0;
      const fn = vi.fn(async () => {
        if (++attempts < 3) throw new Error('fail');
        return 'success';
      });
      const result = await retry(fn, toUint(3), toUint(0));
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });
    it('lève l\'erreur après le nombre max de tentatives', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fail'));
      await expect(retry(fn, toUint(3), toUint(0))).rejects.toThrow('always fail');
      expect(fn).toHaveBeenCalledTimes(3);
    });
    it('abandonne si le signal est aborté', async () => {
      const controller = new AbortController();
      controller.abort();
      const fn = vi.fn().mockRejectedValue(new Error('fail'));
      await expect(
        retry(fn, toUint(3), toUint(0), controller.signal)
      ).rejects.toThrow('retry aborted');
      expect(fn).not.toHaveBeenCalled();
    });
  });

  // ── timeout ─────────────────────────────────────────────────
  describe('timeout', () => {
    it('résout si la promesse se termine avant le délai', async () => {
      const p = Promise.resolve('fast');
      const result = await timeout(p, toUint(200));
      expect(result).toBe('fast');
    });
    it('rejette si la promesse dépasse le délai', async () => {
      const p = new Promise(r => setTimeout(r, 500));
      await expect(timeout(p, toUint(50))).rejects.toThrow('timeout');
    });
  });

  // ── parallel ────────────────────────────────────────────────
  describe('parallel', () => {
    it('exécute toutes les fonctions en parallèle', async () => {
      const results = await parallel([
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
      ]);
      expect(results).toEqual([1, 2, 3]);
    });
    it('retourne un tableau vide si pas de fonctions', async () => {
      expect(await parallel([])).toEqual([]);
    });
    it('rejette si une promesse échoue', async () => {
      await expect(
        parallel([
          () => Promise.resolve(1),
          () => Promise.reject(new Error('boom')),
        ])
      ).rejects.toThrow('boom');
    });
  });

  // ── sequential ──────────────────────────────────────────────
  describe('sequential', () => {
    it('exécute les fonctions dans l\'ordre', async () => {
      const order: number[] = [];
      await sequential([
        async () => { order.push(1); return 1; },
        async () => { order.push(2); return 2; },
        async () => { order.push(3); return 3; },
      ]);
      expect(order).toEqual([1, 2, 3]);
    });
    it('retourne les résultats dans l\'ordre', async () => {
      const results = await sequential([
        () => Promise.resolve('a'),
        () => Promise.resolve('b'),
      ]);
      expect(results).toEqual(['a', 'b']);
    });
    it('retourne un tableau vide si pas de fonctions', async () => {
      expect(await sequential([])).toEqual([]);
    });
  });

});
