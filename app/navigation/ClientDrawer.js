import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import ClientTabs from './ClientTabs';
import MyRequestScreen from '../screens/client/MyRequestScreen';
import ClientSetting from '../screens/client/ClientSetting';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const ClientDrawer = () => {
    const { logout } = useAuth();

    const CustomDrawerContent = (props) => {
        return (
            <View className="flex-1 bg-white pt-12">
                <View className="px-4 mb-6">
                    <Text className="text-2xl font-bold text-secondary-900 mb-2">
                        Client Menu
                    </Text>
                </View>
                <View className="flex-1">
                    {props.state.routes.map((route, index) => {
                        const { options } = props.descriptors[route.key];
                        const label = options.title || route.name;
                        const isFocused = props.state.index === index;

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={() => props.navigation.navigate(route.name)}
                                className={`px-4 py-3 ${isFocused ? 'bg-primary-50' : ''}`}
                            >
                                <Text className={`text-base ${isFocused ? 'text-primary-600 font-semibold' : 'text-secondary-700'}`}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity
                    onPress={logout}
                    className="px-4 py-3 border-t border-secondary-200"
                >
                    <Text className="text-base text-error-600 font-medium">
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
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

