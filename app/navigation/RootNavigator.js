import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ClientDrawer from './ClientDrawer';
import AdminDrawer from './AdminDrawer';
import ProviderDrawer from './ProviderDrawer';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading only briefly - auth screens will show quickly
    // This prevents blocking if auth check takes time
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="mt-4 text-gray-600">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // By default, show auth screens (when not authenticated)
    // This ensures app always shows something

    const getRoleNavigator = () => {
        if (!user || !user.role) {
            return null;
        }

        // Map backend roles to app roles
        const userRole = user.role.toLowerCase();

        switch (userRole) {
            case 'user':
                return <Stack.Screen name="ClientDrawer" component={ClientDrawer} />;
            case 'admin':
                return <Stack.Screen name="AdminDrawer" component={AdminDrawer} />;
            case 'professional':
                return <Stack.Screen name="ProviderDrawer" component={ProviderDrawer} />;
            // Fallback for old role names
            case 'client':
                return <Stack.Screen name="ClientDrawer" component={ClientDrawer} />;
            case 'provider':
                return <Stack.Screen name="ProviderDrawer" component={ProviderDrawer} />;
            default:
                return null;
        }
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {!isAuthenticated ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                        options={{
                            headerShown: true,
                            title: 'Sign Up',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="OTPVerification"
                        component={OTPVerificationScreen}
                        options={{
                            headerShown: true,
                            title: 'Verify Email',
                            headerBackTitleVisible: false,
                        }}
                    />
                </>
            ) : (
                getRoleNavigator()
            )}
        </Stack.Navigator>
    );
};

export default RootNavigator;

