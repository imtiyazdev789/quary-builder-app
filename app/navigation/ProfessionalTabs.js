import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Dashboard from '../screens/common/Dashboard';
import LeadsScreen from '../screens/professional/LeadsScreen';
import ProjectsScreen from '../screens/professional/ProjectsScreen';
import ChatListScreen from '../screens/common/ChatListScreen';

const Tab = createBottomTabNavigator();

const ProfessionalTabs = () => {
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
                headerShown: false, // hide by default; enable only on Dashboard
                tabBarActiveTintColor: '#0d9488', // Brand teal
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0d9488',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
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
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>🏠</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Leads"
                component={LeadsScreen}
                options={{
                    title: 'Leads',
                    tabBarLabel: 'Leads',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>📥</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{
                    title: 'Projects',
                    tabBarLabel: 'Projects',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>📂</Text>
                    ),
                }}
            />
            {/* CHAT FEATURE - TEMPORARILY HIDDEN */}
            {/* <Tab.Screen
                name="Chat"
                component={ChatListScreen}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0d9488',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
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

export default ProfessionalTabs;

