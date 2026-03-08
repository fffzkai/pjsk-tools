export function removeTrail(str: string, trail: string): string {
    if (str.endsWith(trail)) {
        return str.slice(0, -trail.length);
    }
    return str;
}
export function removeLeading(str: string, leading: string): string {
    if (str.startsWith(leading)) {
        return str.slice(leading.length);
    }
    return str;
}
