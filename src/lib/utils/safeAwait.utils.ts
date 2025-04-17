/**
 * A robust utility function to wrap a promise and return a tuple [error, data].
 * This avoids repetitive try–catch blocks in your async code.
 *
 * @template T - The type that the promise resolves to.
 * @param {Promise<T>} promise - The promise to handle.
 * @param {() => void} [finallyFunc] - Optional cleanup callback executed in the finally block.
 * @returns {Promise<[Error, null] | [null, T]>} A tuple containing any error and the data.
 */
export async function safeAwait<T>(promise: Promise<T>, finallyFunc?: () => void): Promise<[Error, null] | [null, T]> {
    try {
        const data = await promise;
        return [null, data];
    } catch (error: unknown) {
        return [error instanceof Error ? error : new Error(String(error)), null];
    } finally {
        if (finallyFunc && typeof finallyFunc === 'function') {
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
 *
 * @template T - The type each promise resolves to.
 * @param {Array<Promise<T>>} promises - An array of promises.
 * @returns {Promise<Array<[Error, null] | [null, T]>>} An array of tuples for each promise.
 */
export async function safeAwaitAll<T>(promises: Array<Promise<T>>): Promise<Array<[Error, null] | [null, T]>> {
    return Promise.all(promises.map((p) => safeAwait(p)));
}
