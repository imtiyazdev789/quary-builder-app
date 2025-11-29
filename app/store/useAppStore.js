import { create } from 'zustand';

const useAppStore = create((set) => ({
    // General app state
    theme: 'light',
    notifications: [],

    // Set theme
    setTheme: (theme) => set({ theme }),

    // Add notification
    addNotification: (notification) =>
        set((state) => ({
            notifications: [...state.notifications, notification],
        })),

    // Remove notification
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    // Clear all notifications
    clearNotifications: () => set({ notifications: [] }),
}));

export default useAppStore;

