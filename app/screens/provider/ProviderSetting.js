import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProviderSetting = () => {
    const { logout, user } = useAuth();
    const [notifications, setNotifications] = React.useState(true);
    const [emailUpdates, setEmailUpdates] = React.useState(true);

    const handleLogout = () => {
        logout();
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <View className="items-center mb-6">
                        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
                            <Text className="text-4xl text-white">👤</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            {user?.name || 'Provider Name'}
                        </Text>
                        <Text className="text-base text-gray-600">
                            {user?.email || 'provider@example.com'}
                        </Text>
                    </View>

                    <View className="bg-white rounded-lg mb-4 shadow-sm">
                        <View className="px-4 py-4 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="text-base text-gray-900">Notifications</Text>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                            />
                        </View>
                        <View className="px-4 py-4 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="text-base text-gray-900">Email Updates</Text>
                            <Switch
                                value={emailUpdates}
                                onValueChange={setEmailUpdates}
                                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                            />
                        </View>
                        <TouchableOpacity className="px-4 py-4 border-b border-gray-200">
                            <Text className="text-base text-gray-900">Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-4">
                            <Text className="text-base text-gray-900">Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="bg-red-600 rounded-lg py-4 px-4 items-center"
                        onPress={handleLogout}
                    >
                        <Text className="text-white text-lg font-semibold">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProviderSetting;

