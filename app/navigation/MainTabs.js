import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>🏠</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Details"
                component={DetailsScreen}
                options={{
                    tabBarLabel: 'Details',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>📋</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ color, fontSize: size }}>👤</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;

