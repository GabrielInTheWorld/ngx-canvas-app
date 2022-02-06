declare global {
    interface Array<T> {
        at(index: number): T;
    }
}

export function setupPolyfills(): void {
    overloadArrayFunctions();
}

function overloadArrayFunctions(): void {
    Object.defineProperty(Array.prototype, `at`, {
        value<T>(index: number): T {
            const _index = index < 0 ? this.length + index : index;
            return this[_index];
        }
    });
}
