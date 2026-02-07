import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Mock notifications structure (will be replaced with real API later)
    const mockNotifications = [
        {
            id: '1',
            type: 'request',
            title: 'New Request Received',
            message: 'You have received a new project request from John Doe',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            actionUrl: 'request/123',
        },
        {
            id: '2',
            type: 'quotation',
            title: 'Quotation Accepted',
            message: 'Your quotation for ABC Project has been accepted by the client',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            actionUrl: 'request/456',
        },
        {
            id: '3',
            type: 'status',
            title: 'Request Status Updated',
            message: 'Your project request status has been updated',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            actionUrl: null,
        },
    ];

    useFocusEffect(
        useCallback(() => {
            // TODO: Fetch real notifications from API
            setNotifications(mockNotifications);
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        // TODO: Fetch notifications from API
        setTimeout(() => {
            setNotifications(mockNotifications);
            setRefreshing(false);
        }, 1000);
    };

    const formatTimestamp = (date) => {
        if (!date) return 'Just now';
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: new Date(date).getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'request':
                return '📋';
            case 'quotation':
                return '💰';
            case 'status':
                return '🔄';
            case 'message':
                return '💬';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'request':
                return 'bg-blue-100 border-blue-200';
            case 'quotation':
                return 'bg-green-100 border-green-200';
            case 'status':
                return 'bg-purple-100 border-purple-200';
            case 'message':
                return 'bg-yellow-100 border-yellow-200';
            default:
                return 'bg-gray-100 border-gray-200';
        }
    };

    const handleNotificationPress = (notification) => {
        // TODO: Navigate to relevant screen based on notification type and actionUrl
        console.log('Notification pressed:', notification);
        // Mark as read
        setNotifications(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                    Notifications
                </Text>
                {unreadCount > 0 && (
                    <TouchableOpacity
                        onPress={markAllAsRead}
                        className="bg-primary-600 rounded-lg px-3 py-1"
                    >
                        <Text className="text-white text-sm font-medium">
                            Mark all read
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="px-4 py-4">
                    {unreadCount > 0 && (
                        <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <Text className="text-blue-900 text-sm font-medium">
                                {unreadCount} {unreadCount === 1 ? 'unread notification' : 'unread notifications'}
                            </Text>
                        </View>
                    )}

                    {notifications.length === 0 ? (
                        <View className="bg-white rounded-lg p-8 items-center mt-8">
                            <Text className="text-6xl mb-4">🔔</Text>
                            <Text className="text-xl font-semibold text-gray-900 mb-2">
                                No Notifications
                            </Text>
                            <Text className="text-base text-gray-600 text-center">
                                You're all caught up! Check back later for updates.
                            </Text>
                        </View>
                    ) : (
                        notifications.map((notification) => (
                            <TouchableOpacity
                                key={notification.id}
                                onPress={() => handleNotificationPress(notification)}
                                className={`bg-white rounded-lg p-4 mb-3 border-2 ${!notification.read
                                    ? getNotificationColor(notification.type)
                                    : 'border-gray-200'
                                    }`}
                            >
                                <View className="flex-row">
                                    <View className="mr-3">
                                        <Text className="text-3xl">
                                            {getNotificationIcon(notification.type)}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row justify-between items-start mb-1">
                                            <Text
                                                className={`text-base font-semibold flex-1 ${!notification.read
                                                    ? 'text-gray-900'
                                                    : 'text-gray-600'
                                                    }`}
                                            >
                                                {notification.title}
                                            </Text>
                                            {!notification.read && (
                                                <View className="w-2 h-2 bg-primary-600 rounded-full ml-2 mt-1" />
                                            )}
                                        </View>
                                        <Text className="text-sm text-gray-700 mb-2 leading-5">
                                            {notification.message}
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {formatTimestamp(notification.timestamp)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationsScreen;
