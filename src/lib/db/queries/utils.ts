
export function FirstOrUndefined<T>(items: T[]) {
    // return the first item, or undefined if there are none
    if (items.length === 0) {
        return undefined;
    }
    return items[0];
}