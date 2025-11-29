import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, BackHandler, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Dashboard from '../screens/common/Dashboard';
import ProviderSetting from '../screens/provider/ProviderSetting';

const Tab = createBottomTabNavigator();

const ProviderTabs = () => {
    const navigation = useNavigation();

    React.useEffect(() => {
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

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#3B82F6',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                headerLeft: () => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
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
                                    } else {
                                        navigation.goBack();
                                    }
                                }
                            }}
                            style={{ marginLeft: 16 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
                        </TouchableOpacity>
                    );
                },
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

