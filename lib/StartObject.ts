/**
 * Abstract base class that provides a structured initialization and execution lifecycle.
 *
 * Subclasses must extend this class and override the protected hook methods
 * `_p_init` and `_p_main` to inject custom initialization and main logic.
 *
 * The lifecycle is triggered via the static {@link AStartObject.Start} factory method,
 * which instantiates the subclass, runs initialization, then runs the main logic —
 * all in a single call.
 *
 * @example
 * ```typescript
 * class MyService extends AStartObject {
 *   protected _p_init(config: string) {
 *     console.log("Initializing with:", config);
 *   }
 *
 *   protected _p_main() {
 *     console.log("Running main logic");
 *   }
 * }
 *
 * MyService.Start("my-config");
 * // Output:
 * // Initializing with: my-config
 * // Running main logic
 * ```
 *
 * @abstract
 */
export abstract class AStartObject {
    constructor() {}

    /**
     * Private entry point for the initialization phase.
     * Delegates to the overridable {@link _p_init} hook.
     *
     * @typeParam T - The type of the arguments passed to the initializer.
     * @param args - Arguments forwarded to {@link _p_init}.
     * @returns The return value of {@link _p_init}.
     */
    #_init<T = unknown>(...args: T[]) {
        return this._p_init(...args);
    }

    /**
     * Protected initialization hook, called once during the startup lifecycle
     * before {@link _p_main}.
     *
     * Override this method in subclasses to perform setup work
     * (e.g. loading configuration, injecting dependencies).
     *
     * @typeParam T - The type of the arguments received.
     * @param args - Arguments forwarded from {@link AStartObject.Start}.
     *
     * @example
     * ```typescript
     * protected _p_init(port: number) {
     *   this.port = port;
     * }
     * ```
     */
    protected _p_init<T = unknown>(...args: T[]) {}

    /**
     * Private entry point for the main execution phase.
     * Delegates to the overridable {@link _p_main} hook.
     *
     * @returns The return value of {@link _p_main}.
     */
    #_main() {
        return this._p_main();
    }

    /**
     * Protected main execution hook, called once during the startup lifecycle
     * after {@link _p_init}.
     *
     * Override this method in subclasses to implement the core logic of the object
     * (e.g. starting a server, launching a process).
     *
     * @example
     * ```typescript
     * protected _p_main() {
     *   this.server.listen(this.port);
     * }
     * ```
     */
    protected _p_main() {}

    /**
     * Static factory method that instantiates a subclass, runs its full lifecycle,
     * and returns the resulting instance.
     *
     * This is the **sole intended entry point** to create and start an `AStartObject`.
     * It performs the following steps in order:
     * 1. Instantiates the concrete subclass via `new`.
     * 2. Calls `#_init(...args)` → dispatches to {@link _p_init}.
     * 3. Calls `#_main()` → dispatches to {@link _p_main}.
     * 4. Returns the fully initialized instance.
     *
     * @typeParam Y - The concrete subclass type being instantiated.
     * @typeParam T - The type of the arguments passed to the initializer.
     * @param args - Arguments forwarded to {@link _p_init} of the subclass.
     * @returns A fully initialized instance of the concrete subclass.
     *
     * @example
     * ```typescript
     * const app = MyApp.Start<MyApp, AppConfig>({ port: 3000, debug: true });
     * ```
     */
    static Start<Y extends AStartObject, T = unknown>(...args: T[]): Y {
        const self = this as any;
        const element = new self() as Y;
        element.#_init(...args);
        element.#_main();

        return element;
    }
}