export module MathUtilities {
    export function negativeSafeModulo(n: number, mod: number) {
        return ((n % mod) + mod) % mod;
    }
}
