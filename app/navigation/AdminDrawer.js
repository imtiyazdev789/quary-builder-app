import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import AdminTabs from './AdminTabs';
import CampaignScreen from '../screens/admin/CampaignScreen';
import RegistrationScreen from '../screens/admin/RegistrationScreen';
import PaymentScreen from '../screens/admin/PaymentScreen';
import ContentScreen from '../screens/admin/ContentScreen';
import { useAuth } from '../context/AuthContext';


const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
    const { logout } = useAuth();

    const CustomDrawerContent = (props) => {
        return (
            <View className="flex-1 bg-white pt-12">
                <View className="px-4 mb-6">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        Admin Menu
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
                                className={`px-4 py-3 ${isFocused ? 'bg-blue-50' : ''}`}
                            >
                                <Text className={`text-base ${isFocused ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity
                    onPress={logout}
                    className="px-4 py-3 border-t border-gray-200"
                >
                    <Text className="text-base text-red-600 font-medium">
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
                    backgroundColor: '#3B82F6',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Drawer.Screen
                name="MainTabs"
                component={AdminTabs}
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="Campaign"
                component={CampaignScreen}
                options={{ title: 'Campaigns' }}
            />
            <Drawer.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{ title: 'Registrations' }}
            />
            <Drawer.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ title: 'Payments' }}
            />
            <Drawer.Screen
                name="Content"
                component={ContentScreen}
                options={{ title: 'Blog Creation' }}
            />
        </Drawer.Navigator>
    );
};

export default AdminDrawer;

