import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to a route using the navigation ref
 * Useful for navigating from outside of components (e.g., services, contexts)
 */
export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    } else {
        console.log('Navigation ref not ready, could not navigate to:', name);
    }
}
