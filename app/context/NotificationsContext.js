import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as navigationRef from '../navigation/navigationRef';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notificationPermission, setNotificationPermission] = useState(false);
    const [lastNotification, setLastNotification] = useState(null);
    const notificationListenersSetup = useRef(false);

    // Request permissions and register token when user logs in
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            initializeNotifications();
        } else {
            // Clean up when user logs out
            if (notificationListenersSetup.current) {
                notificationService.removeNotificationListeners();
                notificationListenersSetup.current = false;
            }
        }

        return () => {
            if (notificationListenersSetup.current) {
                notificationService.removeNotificationListeners();
            }
        };
    }, [isAuthenticated, user]);

    const initializeNotifications = async () => {
        try {
            // Request permissions
            const hasPermission = await notificationService.requestPermissions();
            setNotificationPermission(hasPermission);

            if (hasPermission) {
                // Register device token with backend
                await notificationService.registerDeviceToken(user.id);

                // Set up listeners (only once)
                if (!notificationListenersSetup.current) {
                    notificationService.setupNotificationListeners(
                        handleNotificationReceived,
                        handleNotificationTapped
                    );
                    notificationListenersSetup.current = true;
                }
            }
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    };

    const handleNotificationReceived = (notification) => {
        console.log('Notification received in foreground:', notification);
        setLastNotification(notification);
    };

    const handleNotificationTapped = (response) => {
        const { notification } = response;
        const data = notification.request.content.data;

        console.log('Notification tapped, data:', data);

        // Navigate based on notification type
        try {
            switch (data.type) {
                case 'NEW_REQUEST':
                    if (data.requestId) {
                        navigationRef.navigate('RequestDetails', { requestId: data.requestId });
                    }
                    break;

                case 'REQUEST_ACCEPTED':
                    if (data.requestId) {
                        navigationRef.navigate('RequestDetails', { requestId: data.requestId });
                    }
                    break;

                case 'NEW_MESSAGE':
                    if (data.chatId) {
                        navigationRef.navigate('Chat', { chatId: data.chatId });
                    }
                    break;

                case 'REQUEST_COMPLETED':
                    if (data.requestId) {
                        navigationRef.navigate('RequestDetails', { requestId: data.requestId });
                    }
                    break;

                default:
                    console.log('Unknown notification type:', data.type);
            }
        } catch (error) {
            console.error('Error navigating from notification:', error);
        }
    };

    const requestPermissions = async () => {
        const hasPermission = await notificationService.requestPermissions();
        setNotificationPermission(hasPermission);
        return hasPermission;
    };

    const clearNotifications = async () => {
        await notificationService.clearAllNotifications();
    };

    const value = {
        notificationPermission,
        lastNotification,
        requestPermissions,
        clearNotifications,
        registerDeviceToken: () => notificationService.registerDeviceToken(user?.id),
        unregisterDeviceToken: notificationService.unregisterDeviceToken,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
