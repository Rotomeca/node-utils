/**
 * Type représentant un constructeur concret (non abstrait) d'une sous-classe de `AStartObject`.
 *
 * Utilisé en interne par {@link AStartObject.Start} pour instancier la sous-classe
 * sans passer par `any`.
 *
 * @internal
 */
type ConcreteConstructor<T> = new () => T;

/**
 * Classe de base abstraite fournissant un cycle de vie structuré : initialisation puis exécution.
 *
 * Les sous-classes doivent surcharger {@link _p_init} et {@link _p_main} pour injecter
 * leur logique métier. Le cycle de vie est déclenché via la méthode statique {@link Start},
 * seul point d'entrée prévu pour instancier un `AStartObject`.
 *
 * @example
 * ```typescript
 * class MyService extends AStartObject {
 *   private port!: number;
 *
 *   protected _p_init(port: number): void {
 *     this.port = port;
 *   }
 *
 *   protected _p_main(): void {
 *     console.log(`Listening on port ${this.port}`);
 *   }
 * }
 *
 * MyService.Start(3000);
 * // Output: Listening on port 3000
 * ```
 *
 * @abstract
 */
export abstract class AStartObject {

    constructor() {}

    /**
     * Déclenche la phase d'initialisation en déléguant à {@link _p_init}.
     *
     * Déclaré `private` (et non `#`) afin de rester accessible depuis la méthode
     * statique {@link Start} sur une instance typée `AStartObject`, tout en restant
     * invisible à l'extérieur de la classe.
     *
     * @param args - Arguments transmis à {@link _p_init}.
     */
    private _init(...args: unknown[]): void {
        this._p_init(...args);
    }

    /**
     * Déclenche la phase d'exécution principale en déléguant à {@link _p_main}.
     *
     * Même justification que {@link _init} pour l'usage de `private`.
     */
    private _main(): void {
        this._p_main();
    }

    /**
     * Hook d'initialisation, appelé une seule fois avant {@link _p_main}.
     *
     * Surchargez cette méthode pour effectuer le travail de setup
     * (chargement de configuration, injection de dépendances, etc.).
     *
     * @param args - Arguments transmis depuis {@link Start}.
     *
     * @example
     * ```typescript
     * protected _p_init(port: number): void {
     *   this.port = port;
     * }
     * ```
     */
    protected _p_init(...args: unknown[]): void {}

    /**
     * Hook d'exécution principale, appelé une seule fois après {@link _p_init}.
     *
     * Surchargez cette méthode pour implémenter la logique cœur de l'objet
     * (démarrage d'un serveur, lancement d'un processus, etc.).
     *
     * @example
     * ```typescript
     * protected _p_main(): void {
     *   this.server.listen(this.port);
     * }
     * ```
     */
    protected _p_main(): void {}

    /**
     * Méthode factory statique : instancie la sous-classe concrète, exécute son cycle
     * de vie complet et retourne l'instance prête à l'emploi.
     *
     * C'est le **seul point d'entrée** prévu pour créer un `AStartObject`.
     * Les étapes sont, dans l'ordre :
     * 1. Instanciation de la sous-classe concrète.
     * 2. Appel de `_init(...args)` → dispatche vers {@link _p_init}.
     * 3. Appel de `_main()` → dispatche vers {@link _p_main}.
     * 4. Retour de l'instance complètement initialisée.
     *
     * ### Pourquoi le cast ?
     * TypeScript interdit `new this()` sur une classe abstraite, même depuis une méthode
     * statique. Le cast `as unknown as ConcreteConstructor<Y>` est **inévitable** à cet
     * endroit précis : il est localisé, documenté, et sans fuite vers l'extérieur.
     * L'invariant est garanti par le fait que `Start` ne peut être appelée que sur une
     * sous-classe concrète — TypeScript lèvera une erreur à la construction sinon.
     *
     * @typeParam Y - Type de la sous-classe concrète instanciée.
     * @param args - Arguments transmis à {@link _p_init} de la sous-classe.
     * @returns Une instance complètement initialisée de la sous-classe concrète.
     *
     * @example
     * ```typescript
     * const app = MyApp.Start(3000, true);
     * ```
     */
    static Start<Y extends AStartObject>(...args: unknown[]): Y {
        const ctor = this as unknown as ConcreteConstructor<Y>;
        const element = new ctor();

        element._init(...args);
        element._main();

        return element;
    }
}