/**
 * Simple event emitter to bridge axios interceptor → AuthContext.
 * When API returns 401 (jwt expired / invalid), the interceptor fires
 * 'SESSION_EXPIRED' and AuthContext listens + calls logout().
 */
const listeners = new Set();

const authEvents = {
    subscribe(callback) {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },
    emit(event) {
        listeners.forEach((cb) => cb(event));
    },
};

export default authEvents;
