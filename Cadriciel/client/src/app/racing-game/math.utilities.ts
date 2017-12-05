export module MathUtilities {
    export function negativeSafeModulo(n: number, mod: number) {
        return ((n % mod) + mod) % mod;
    }

    export function distanceBetweenTwoPoints(first: THREE.Vector2, second: THREE.Vector2): number {
        const xDifference = Math.abs(first.x - second.x);
        const yDifference = Math.abs(first.y - second.y);
        return hypotenuseLength(xDifference, yDifference);
    }

    function hypotenuseLength(x: number, y: number): number {
        return Math.sqrt(x * x + y * y);
    }
}
