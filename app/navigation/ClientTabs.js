import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../screens/common/Dashboard';
import MyRequestScreen from '../screens/client/MyRequestScreen';
import ChatListScreen from '../screens/common/ChatListScreen';

const Tab = createBottomTabNavigator();

const ClientTabs = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const state = navigation.getState();
            const routes = state.routes;
            const currentRoute = routes[routes.length - 1];

            // Check if we're in the tab navigator and on Dashboard
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
                headerShown: false,
                tabBarActiveTintColor: '#0d9488',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: -2,
                },
                tabBarStyle: {
                    paddingBottom: 8,
                    paddingTop: 10,
                    height: 68,
                    borderTopWidth: 0,
                    backgroundColor: '#ffffff',
                    elevation: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    borderRadius: 50,
                    paddingHorizontal: 10,
                },
                animation: 'fade',
                animationDuration: 200,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="MyRequest"
                component={MyRequestScreen}
                options={{
                    title: 'My Requests',
                    tabBarLabel: 'Requests',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text" size={size} color={color} />
                    ),
                }}
            />
            {/* CHAT FEATURE - TEMPORARILY HIDDEN */}
            {/* <Tab.Screen
                name="Chat"
                component={ChatListScreen}
                options={{
                    title: 'Messages',
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>💬</Text>
                    ),
                }}
            /> */}
        </Tab.Navigator>
    );
};

export default ClientTabs;

