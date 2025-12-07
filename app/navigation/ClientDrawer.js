import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClientTabs from './ClientTabs';
import MyRequestScreen from '../screens/client/MyRequestScreen';
import ClientSetting from '../screens/client/ClientSetting';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';

const Drawer = createDrawerNavigator();

const ClientDrawer = () => {
    const { logout, user } = useAuth();
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);

    const handleLogout = () => {
        setLogoutAlertVisible(true);
    };

    const confirmLogout = () => {
        setLogoutAlertVisible(false);
        logout();
    };

    const CustomDrawerContent = (props) => {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
                <View className="flex-1">
                    <View className="px-4 py-6 border-b border-secondary-100">
                        <Text className="text-2xl font-bold text-secondary-900">
                            Client Menu
                        </Text>
                        {user?.email && (
                            <Text className="text-sm text-secondary-500 mt-1">
                                {user.email}
                            </Text>
                        )}
                    </View>
                    <View className="flex-1 pt-2">
                        {props.state.routes.map((route, index) => {
                            const { options } = props.descriptors[route.key];
                            const label = options.title || route.name;
                            const isFocused = props.state.index === index;

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    onPress={() => props.navigation.navigate(route.name)}
                                    className={`px-4 py-4 flex-row items-center ${isFocused ? 'bg-primary-50' : ''}`}
                                >
                                    <Text className={`text-base ${isFocused ? 'text-primary-600 font-semibold' : 'text-secondary-700'}`}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="px-4 py-4 border-t border-secondary-200 flex-row items-center"
                    >
                        <Text className="text-lg mr-2">🚪</Text>
                        <Text className="text-base text-error-600 font-semibold">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>

                <CustomAlert
                    visible={logoutAlertVisible}
                    title="Logout"
                    message="Are you sure you want to logout?"
                    icon="👋"
                    buttons={[
                        { text: 'Cancel', onPress: () => setLogoutAlertVisible(false), style: 'secondary' },
                        { text: 'Logout', onPress: confirmLogout, style: 'danger' },
                    ]}
                    onClose={() => setLogoutAlertVisible(false)}
                />
            </SafeAreaView>
        );
    };

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0d9488', // Brand teal
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Drawer.Screen
                name="MainTabs"
                component={ClientTabs}
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="MyRequest"
                component={MyRequestScreen}
                options={{ title: 'My Requests' }}
            />
            <Drawer.Screen
                name="Setting"
                component={ClientSetting}
                options={{ title: 'Settings' }}
            />
        </Drawer.Navigator>
    );
};

export default ClientDrawer;

