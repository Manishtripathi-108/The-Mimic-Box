import { isAxiosError } from 'axios';

type SafeResult<T> = [error: Record<string, unknown> | Error, data: null] | [error: null, data: T];

/**
 * A robust utility function to wrap a promise and return a tuple [error, data].
 */
export async function safeAwait<T>(promise: Promise<T>, finallyFunc?: () => void): Promise<SafeResult<T>> {
    try {
        const data = await promise;
        return [null, data];
    } catch (err: unknown) {
        let error: Record<string, unknown> | Error = new Error('Something went wrong');
        if (isAxiosError(err)) {
            error = err;
        } else if (err instanceof Error) {
            error = err;
        }
        return [error, null];
    } finally {
        if (finallyFunc) {
            try {
                finallyFunc();
            } catch (err) {
                console.error('Error in safeAwait finally callback:', err);
            }
        }
    }
}

/**
 * A helper function to process multiple promises concurrently using safeAwait.
 */
export async function safeAwaitAll<T>(promises: Array<Promise<T>>): Promise<Array<SafeResult<T>>> {
    return Promise.all(promises.map((p) => safeAwait(p)));
}
