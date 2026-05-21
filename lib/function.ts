import { Action, Func, Nullable, uint } from "./types";

/**
 * Retarde l'exécution d'une fonction jusqu'à ce qu'un délai se soit écoulé
 * sans nouvel appel. Chaque appel remet le timer à zéro.
 *
 * Utile pour limiter les appels sur des événements haute fréquence comme
 * la saisie dans un champ de recherche ou le redimensionnement de la fenêtre.
 *
 * @typeParam T - Type de la fonction à différer, doit être une {@link Action}.
 * @param fn - La fonction à exécuter après le délai.
 * @param ms - Le délai en millisecondes avant l'exécution.
 * @returns Une nouvelle fonction qui diffère l'appel à `fn`.
 *
 * @example
 * ```ts
 * const onSearch = debounce((query: string) => fetchResults(query), 300);
 * input.addEventListener('input', e => onSearch(e.target.value));
 * ```
 */
export function debounce<T extends Action>(fn: T, ms: uint): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, ms);
    }) as unknown as T;
}

/**
 * Garantit qu'une fonction ne s'exécute pas plus d'une fois par tranche
 * de temps donnée, peu importe le nombre d'appels reçus.
 *
 * Contrairement à {@link debounce}, le premier appel s'exécute immédiatement.
 * Les appels suivants sont ignorés jusqu'à l'expiration du délai.
 *
 * @typeParam T - Type de la fonction à limiter, doit être une {@link Action}.
 * @param fn - La fonction dont la fréquence d'exécution est à limiter.
 * @param ms - L'intervalle minimal en millisecondes entre deux exécutions.
 * @returns Une nouvelle fonction dont la fréquence d'appel est limitée.
 *
 * @example
 * ```ts
 * const onScroll = throttle(() => updateScrollbar(), 100);
 * window.addEventListener('scroll', onScroll);
 * ```
 */
export function throttle<T extends Action>(fn: T, ms: uint): T {
    let lastCall: Nullable<number> = null;

    return ((...args: Parameters<T>) => {
        const now = Date.now();
        if (lastCall === null || now - lastCall >= ms) {
            fn(...args);
            lastCall = now;
        }
    }) as unknown as T;
}

/**
 * Retourne une version mémoïsée de `fn` qui met en cache ses résultats.
 *
 * Lors d'un appel avec des arguments déjà rencontrés, le résultat est
 * retourné depuis le cache sans réexécuter `fn`.
 *
 * @typeParam T - Type de la fonction à mémoïser, doit être une {@link Func}.
 * @param fn - La fonction pure à mémoïser.
 * @returns Une nouvelle fonction avec mise en cache automatique des résultats.
 *
 * @remarks
 * Les arguments doivent être sérialisables en JSON — les objets sont comparés
 * par valeur et non par référence : `memoize(fn)({a:1})` et `memoize(fn)({a:1})`
 * partagent le même cache.
 *
 * Ne pas utiliser avec des fonctions impures (`Date.now`, `Math.random`, effets
 * de bord) : le cache retournerait indéfiniment le premier résultat obtenu.
 *
 * @remarks Le cache est illimité — ne pas utiliser avec un grand nombre de combinaisons d'arguments
 * 
 * @example
 * ```ts
 * const expensiveCalc = memoize((n: number) => fibonacci(n));
 * expensiveCalc(40); // calcul effectué
 * expensiveCalc(40); // retourné depuis le cache
 * ```
 */
export function memoize<T extends Func>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args);

        if (cache.has(key)) return cache.get(key) as ReturnType<T>;

        const result = fn(...args) as ReturnType<T>;
        cache.set(key, result);

        return result;
    }) as unknown as T;
}

/**
 * Retourne une version de `fn` qui ne s'exécute qu'une seule fois.
 *
 * Le résultat du premier appel est mis en cache et retourné directement
 * pour tous les appels suivants, sans réexécuter `fn`. La référence à `fn`
 * est libérée après le premier appel pour éviter les fuites mémoire.
 *
 * @typeParam T - Type de la fonction à restreindre, doit être une {@link Func}.
 * @param fn - La fonction à n'exécuter qu'une seule fois.
 * @returns Une nouvelle fonction qui délègue à `fn` uniquement au premier appel.
 *
 * @example
 * ```ts
 * const initApp = once(() => {
 *   console.log('Initialisation...');
 *   return createApp();
 * });
 *
 * initApp(); // exécute fn, retourne l'app
 * initApp(); // retourne le même résultat, fn n'est pas réexécutée
 * ```
 */
export function once<T extends Func>(fn: T): T {
    let called = false;
    let result: ReturnType<T>;
    let _fn: T | null = fn;

    return ((...args: Parameters<T>) => {
        if (called) return result;

        called = true;
        result = _fn!(...args);
        _fn = null;

        return result;
    }) as unknown as T;
}

/**
 * Fonction vide qui ne fait rien et ne retourne rien.
 *
 * Utilisée comme valeur par défaut pour des callbacks optionnels, afin
 * d'éviter les vérifications `if (fn) fn()` et améliorer la lisibilité.
 *
 * @example
 * ```ts
 * function createButton(onClick: Action = noop) {
 *   return { onClick };
 * }
 * ```
 */
export function noop(): void {}

/**
 * Retourne la valeur passée en argument sans modification.
 *
 * Utile comme fonction par défaut dans un {@link pipe}, un `map`, ou
 * partout où une fonction de transformation est attendue mais non nécessaire.
 *
 * @typeParam T - Type de la valeur.
 * @param x - La valeur à retourner.
 * @returns La valeur `x` inchangée.
 *
 * @example
 * ```ts
 * [1, 2, 3].map(identity) // -> [1, 2, 3]
 * pipe("hello", identity) // -> "hello"
 * ```
 */
export function identity<T>(x: T): T {
    return x;
}