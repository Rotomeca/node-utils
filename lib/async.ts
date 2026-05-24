
import { uint } from "./types";
import { UI_ZERO } from "./constants";

export function sleep(ms: uint): Promise<void> {
    return new Promise(ok => setTimeout(ok, ms));
}

export async function retry<T>(
    fn: () => Promise<T>,
    attempts: uint,
    delay: uint,
    signal?: AbortSignal
): Promise<T> {
    let trys = UI_ZERO;

    while (true) {
        if (signal?.aborted) throw new Error('retry aborted');

        try {
            return await fn();
        } catch (error) {
            ++trys;
            if (trys >= attempts) throw error;
        }

        await sleep(delay);
    }
}

export async function timeout<T>(promise: Promise<T>, ms: uint): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), ms);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        clearTimeout(timer);
    }) as Promise<T>;
}

export function parallel<T>(fns: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(fns.map((fn) => fn()));
}

export async function* sequentialGenerator<T>(
    fns: Array<() => Promise<T>>
): AsyncGenerator<Awaited<T>, void, unknown> {
    for (let i = 0, len = fns.length; i < len; ++i) {
        yield fns[i]();
    }
}

export async function sequential<T>(fns: Array<() => Promise<T>>): Promise<T[]> {
    const results: T[] = [];

    for await (const result of sequentialGenerator(fns)) {
        results.push(result);
    }

    return results;
}