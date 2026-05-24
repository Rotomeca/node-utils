import { uint } from "./types";
import { UI_ZERO } from "./constants";

/**
 * Suspend l'exécution d'une fonction `async` pendant la durée spécifiée.
 *
 * @param ms - Durée de la pause en millisecondes.
 * @returns Une `Promise` qui se résout après `ms` millisecondes.
 *
 * @example
 * ```ts
 * await sleep(toUint(500)); // attend 500ms
 * ```
 *
 */
export function sleep(ms: uint): Promise<void> {
  return new Promise((ok) => setTimeout(ok, ms));
}

/**
 * Tente d'exécuter `fn` jusqu'à `attempts` fois en cas d'échec.
 *
 * Entre chaque tentative, attend `delay` millisecondes. Si toutes les
 * tentatives échouent, l'erreur de la dernière tentative est propagée.
 * L'exécution peut être annulée à tout moment via un `AbortSignal`.
 *
 * @typeParam T - Type de la valeur retournée par `fn` en cas de succès.
 * @param fn - Fonction asynchrone à exécuter, pouvant être réessayée.
 * @param attempts - Nombre maximum de tentatives (entier non signé).
 * @param delay - Délai en millisecondes entre chaque tentative (entier non signé).
 * @param signal - Signal d'annulation optionnel. Si déclenché avant une tentative,
 *                 lève immédiatement une `Error('retry aborted')`.
 * @returns Une `Promise` résolvant avec la valeur de `fn` dès qu'une tentative réussit.
 * @throws L'erreur de la dernière tentative si toutes ont échoué.
 * @throws `Error('retry aborted')` si le signal est annulé avant une tentative.
 *
 * @example
 * ```ts
 * const data = await retry(
 *   () => fetch('/api/data').then(r => r.json()),
 *   toUint(3),    // 3 tentatives maximum
 *   toUint(500),  // 500ms entre chaque tentative
 * );
 * ```
 *
 * @example
 * ```ts
 * // Avec annulation
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 2000);
 *
 * const data = await retry(
 *   () => fetchSomething(),
 *   toUint(5),
 *   toUint(300),
 *   controller.signal,
 * );
 * ```
 *
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: uint,
  delay: uint,
  signal?: AbortSignal,
): Promise<T> {
  let trys = UI_ZERO;
  while (true) {
    if (signal?.aborted) throw new Error("retry aborted");
    try {
      return await fn();
    } catch (error) {
      ++trys;
      if (trys >= attempts) throw error;
    }
    await sleep(delay);
  }
}

/**
 * Ajoute une limite de temps à une `Promise` existante.
 *
 * Si la promesse ne se résout pas dans les `ms` millisecondes imparties,
 * elle est rejetée avec une `Error('timeout')`. Le timer est toujours nettoyé
 * après résolution ou rejet, qu'il y ait eu timeout ou non.
 *
 * @typeParam T - Type de la valeur retournée par la promesse.
 * @param promise - La promesse à surveiller.
 * @param ms - Délai maximum en millisecondes avant rejet (entier non signé).
 * @returns Une `Promise` qui résout avec la valeur de `promise` si elle se termine
 *          dans le délai imparti, ou rejette avec `Error('timeout')` sinon.
 * @throws `Error('timeout')` si la promesse dépasse le délai.
 *
 * @example
 * ```ts
 * const result = await timeout(
 *   fetch('/api/slow-endpoint').then(r => r.json()),
 *   toUint(3000), // 3 secondes maximum
 * );
 * ```
 *
 */
export async function timeout<T>(promise: Promise<T>, ms: uint): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  }) as Promise<T>;
}

/**
 * Exécute toutes les fonctions asynchrones en parallèle et retourne leurs résultats.
 *
 * Équivalent typé de `Promise.all` — accepte des fonctions `() => Promise<T>`
 * plutôt que des promesses déjà démarrées (évaluation paresseuse).
 * Si l'une des fonctions rejette, la promesse retournée rejette immédiatement.
 *
 * @typeParam T - Type commun des valeurs retournées par les fonctions.
 * @param fns - Tableau de fonctions asynchrones à exécuter en parallèle.
 * @returns Une `Promise` résolvant avec un tableau des résultats dans le même
 *          ordre que `fns`.
 *
 * @example
 * ```ts
 * const [users, posts] = await parallel([
 *   () => fetchUsers(),
 *   () => fetchPosts(),
 * ]);
 * ```
 *
 */
export function parallel<T>(fns: Array<() => Promise<T>>): Promise<T[]> {
  return Promise.all(fns.map((fn) => fn()));
}

/**
 * Générateur asynchrone exécutant les fonctions une par une dans l'ordre.
 *
 * Chaque `yield` attend la résolution de la fonction courante avant de passer
 * à la suivante. Utile pour itérer sur les résultats intermédiaires avec
 * `for await...of` sans attendre la fin de toutes les opérations.
 *
 * @typeParam T - Type des valeurs produites par les fonctions.
 * @param fns - Tableau de fonctions asynchrones à exécuter séquentiellement.
 * @yields La valeur résolue de chaque fonction, dans l'ordre.
 *
 * @example
 * ```ts
 * for await (const result of sequentialGenerator([step1, step2, step3])) {
 *   console.log('Étape terminée :', result);
 * }
 * ```
 *
 */
export async function* sequentialGenerator<T>(
  fns: Array<() => Promise<T>>,
): AsyncGenerator<Awaited<T>, void, unknown> {
  for (let i = 0, len = fns.length; i < len; ++i) {
    yield fns[i]();
  }
}

/**
 * Exécute les fonctions asynchrones une par une dans l'ordre et retourne tous leurs résultats.
 *
 * Contrairement à {@link parallel}, chaque fonction attend que la précédente
 * soit terminée avant de démarrer. Utile pour les opérations qui doivent
 * s'exécuter dans un ordre précis ou qui partagent une ressource exclusive.
 *
 * @typeParam T - Type commun des valeurs retournées par les fonctions.
 * @param fns - Tableau de fonctions asynchrones à exécuter séquentiellement.
 * @returns Une `Promise` résolvant avec un tableau des résultats dans l'ordre d'exécution.
 *
 * @example
 * ```ts
 * const results = await sequential([
 *   () => createUser(data),
 *   () => sendWelcomeEmail(data.email),
 *   () => logAuditEvent('user_created'),
 * ]);
 * ```
 *
 * @see {@link parallel} pour une exécution en parallèle.
 * @see {@link sequentialGenerator} pour itérer sur les résultats intermédiaires.
 *
 */
export async function sequential<T>(
  fns: Array<() => Promise<T>>,
): Promise<T[]> {
  const results: T[] = [];
  for await (const result of sequentialGenerator(fns)) {
    results.push(result);
  }
  return results;
}
