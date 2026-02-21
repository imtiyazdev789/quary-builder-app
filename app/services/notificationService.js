import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class NotificationService {
    constructor() {
        this.notificationListener = null;
        this.responseListener = null;
    }

    /**
     * Request notification permissions from the user
     */
    async requestPermissions() {
        try {
            if (!Device.isDevice) {
                console.warn('Push notifications only work on physical devices');
                return false;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Failed to get push notification permissions');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    }

    /**
     * Get the Expo push token for this device
     */
    async getExpoPushToken() {
        try {
            if (!Device.isDevice) {
                console.warn('Push notifications only work on physical devices');
                return null;
            }

            const projectId = Constants.expoConfig?.extra?.eas?.projectId;

            if (!projectId) {
                console.error('Project ID not found in app config');
                return null;
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });

            return token.data;
        } catch (error) {
            console.error('Error getting Expo push token:', error);
            return null;
        }
    }

    /**
     * Register device token with backend
     */
    async registerDeviceToken(userId) {
        try {
            // Skip if not on physical device
            if (!Device.isDevice) {
                console.log('Skipping push notification registration (not a physical device)');
                return false;
            }

            const hasPermission = await this.requestPermissions();

            if (!hasPermission) {
                console.log('Notification permissions not granted, skipping registration');
                return false;
            }

            const token = await this.getExpoPushToken();

            if (!token) {
                console.log('Failed to get push token, skipping registration');
                return false;
            }

            // Get auth token
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                console.log('No auth token found, skipping device token registration');
                return false;
            }

            // Import Router dynamically to avoid circular dependency
            const Router = require('../config/Router').default;

            // Send token to backend
            const response = await axios.post(
                `${API_BASE_URL}${Router.NOTIFICATION.REGISTER_TOKEN}`,
                {
                    token,
                    platform: Platform.OS,
                    deviceId: Constants.deviceId || Device.modelId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.data.success) {
                console.log('✅ Device token registered successfully');
                await AsyncStorage.setItem('deviceToken', token);
                return true;
            }

            return false;
        } catch (error) {
            // Gracefully handle errors - don't crash the app
            console.log('🔍 Device token registration error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 404) {
                console.log('⚠️  Notification endpoint not found (404)');
            } else if (error.response?.status === 401) {
                console.log('⚠️  Auth token invalid or expired (401)');
            } else if (error.response?.status) {
                console.log(`⚠️  Server error (${error.response.status}):`, error.response.data?.message || 'Unknown error');
            } else {
                console.log('⚠️  Network or request error:', error.message);
            }
            // Return false but don't throw - app should continue working
            return false;
        }
    }

    /**
     * Unregister device token from backend
     */
    async unregisterDeviceToken() {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            const deviceToken = await AsyncStorage.getItem('deviceToken');

            if (!authToken || !deviceToken) {
                return false;
            }

            // Import Router dynamically to avoid circular dependency
            const Router = require('../config/Router').default;

            await axios.delete(
                `${API_BASE_URL}${Router.NOTIFICATION.UNREGISTER_TOKEN}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    data: { token: deviceToken },
                }
            );

            await AsyncStorage.removeItem('deviceToken');
            console.log('✅ Device token unregistered successfully');
            return true;
        } catch (error) {
            // Gracefully handle errors
            console.log('⚠️  Could not unregister device token:', error.message);
            return false;
        }
    }

    /**
     * Set up notification listeners
     */
    setupNotificationListeners(onNotificationReceived, onNotificationTapped) {
        // Listener for notifications received while app is foregrounded
        this.notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log('Notification received:', notification);
                if (onNotificationReceived) {
                    onNotificationReceived(notification);
                }
            }
        );

        // Listener for when user taps on a notification
        this.responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log('Notification tapped:', response);
                if (onNotificationTapped) {
                    onNotificationTapped(response);
                }
            }
        );
    }

    /**
     * Remove notification listeners
     */
    removeNotificationListeners() {
        try {
            // Check if removeNotificationSubscription exists (not available in Expo Go)
            if (this.notificationListener && Notifications.removeNotificationSubscription) {
                Notifications.removeNotificationSubscription(this.notificationListener);
            }
            if (this.responseListener && Notifications.removeNotificationSubscription) {
                Notifications.removeNotificationSubscription(this.responseListener);
            }
        } catch (error) {
            // Silently handle - this is expected in Expo Go
            console.log('⚠️  Could not remove notification listeners (Expo Go limitation)');
        }
    }

    /**
     * Schedule a local notification (for testing)
     */
    async scheduleLocalNotification(title, body, data = {}, seconds = 1) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    sound: true,
                },
                trigger: {
                    seconds,
                },
            });
        } catch (error) {
            console.error('Error scheduling local notification:', error);
        }
    }

    /**
     * Clear all notifications
     */
    async clearAllNotifications() {
        try {
            await Notifications.dismissAllNotificationsAsync();
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    }

    /**
     * Get badge count
     */
    async getBadgeCount() {
        try {
            return await Notifications.getBadgeCountAsync();
        } catch (error) {
            console.error('Error getting badge count:', error);
            return 0;
        }
    }

    /**
     * Set badge count
     */
    async setBadgeCount(count) {
        try {
            await Notifications.setBadgeCountAsync(count);
        } catch (error) {
            console.error('Error setting badge count:', error);
        }
    }
}

export default new NotificationService();
