/**
 * To check if a string is a valid json
 * Handle non-exception-throwing cases:
 * Neither JSON.parse(false) or JSON.parse(1234) throw errors,
 * hence the type-checking,
 * but... JSON.parse(null) returns null, and typeof null === "object",
 * so we must check for that, too. Thankfully, null is falsey,
 * so this suffices
 * @param str
 */
export function isValidJson(str: string): boolean {
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === 'object') {
            return parsed;
        }
    } catch (e) {}

    return false;
}
