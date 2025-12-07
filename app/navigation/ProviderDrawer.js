import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import ProviderTabs from './ProviderTabs';
import LeadsScreen from '../screens/provider/LeadsScreen';
import ProjectsScreen from '../screens/provider/ProjectsScreen';
import ReviewsScreen from '../screens/provider/ReviewsScreen';
import SubscriptionScreen from '../screens/provider/SubscriptionScreen';
import { useAuth } from '../context/AuthContext';


const Drawer = createDrawerNavigator();

const ProviderDrawer = () => {
    const { logout } = useAuth();

    const CustomDrawerContent = (props) => {
        return (
            <View className="flex-1 bg-white pt-12">
                <View className="px-4 mb-6">
                    <Text className="text-2xl font-bold text-secondary-900 mb-2">
                        Provider Menu
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
                component={ProviderTabs}
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="Leads"
                component={LeadsScreen}
                options={{ title: 'Leads' }}
            />
            <Drawer.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{ title: 'Projects' }}
            />
            <Drawer.Screen
                name="Reviews"
                component={ReviewsScreen}
                options={{ title: 'Reviews' }}
            />
            <Drawer.Screen
                name="Subscription"
                component={SubscriptionScreen}
                options={{ title: 'Subscription' }}
            />
        </Drawer.Navigator>
    );
};

export default ProviderDrawer;

