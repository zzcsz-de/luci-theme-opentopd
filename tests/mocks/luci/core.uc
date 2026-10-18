// Host-only stand-in for the router's luci.core C module.
// Template compilation/rendering tests do not exercise shadow database access.
export function getuid() { return 0; }
export function getspnam(user) { return { pwdp: 'test-password-hash' }; }
