import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Dashboard from '../screens/common/Dashboard';
import ProviderSetting from '../screens/provider/ProviderSetting';

const Tab = createBottomTabNavigator();

const ProviderTabs = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const state = navigation.getState();
            const routes = state.routes;
            const currentRoute = routes[routes.length - 1];

            if (currentRoute.state) {
                const tabState = currentRoute.state;
                const currentTab = tabState.routes[tabState.index];

                if (currentTab?.name === 'Dashboard') {
                    Alert.alert(
                        'Exit App',
                        'Do you want to exit the app?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Exit',
                                onPress: () => BackHandler.exitApp(),
                            },
                        ]
                    );
                    return true;
                }
            }
            return false;
        });

        return () => backHandler.remove();
    }, [navigation]);

    // Open drawer function
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0d9488', // Brand teal
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#0d9488', // Brand teal
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                // Menu button on the right to open drawer
                headerRight: () => (
                    <TouchableOpacity
                        onPress={openDrawer}
                        style={{ marginRight: 16, padding: 4 }}
                    >
                        <View style={{ gap: 4 }}>
                            <View style={{ width: 22, height: 2.5, backgroundColor: '#fff', borderRadius: 2 }} />
                            <View style={{ width: 22, height: 2.5, backgroundColor: '#fff', borderRadius: 2 }} />
                            <View style={{ width: 22, height: 2.5, backgroundColor: '#fff', borderRadius: 2 }} />
                        </View>
                    </TouchableOpacity>
                ),
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>🏠</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProviderSetting}
                options={{
                    title: 'Profile',
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>👤</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default ProviderTabs;

