import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

    // Floating hamburger menu component
    const FloatingMenu = () => (
        <View style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
        }}>
            <TouchableOpacity
                onPress={openDrawer}
                style={{
                    padding: 12,
                    backgroundColor: '#0d9488',
                    borderRadius: 18,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <View style={{ gap: 4 }}>
                    <View style={{ width: 24, height: 3, backgroundColor: '#fff', borderRadius: 2 }} />
                    <View style={{ width: 24, height: 3, backgroundColor: '#fff', borderRadius: 2 }} />
                    <View style={{ width: 24, height: 3, backgroundColor: '#fff', borderRadius: 2 }} />
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <FloatingMenu />
            <Tab.Navigator
                screenOptions={{
                    headerShown: false, // Completely hide header
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
                        title: 'Dashboard',
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
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
                            <Ionicons name="mail" size={size} color={color} />
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
                            <Ionicons name="folder" size={size} color={color} />
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
        </>
    );
};

export default ProfessionalTabs;

