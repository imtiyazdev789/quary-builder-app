import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ClientDrawer from './ClientDrawer';
import ProviderDrawer from './ProviderDrawer';
import AdminDrawer from './AdminDrawer';

// Demo mode imports - for previewing without auth
import ClientDashboard from '../screens/client/ClientDashboard';
import ProviderDashboard from '../screens/provider/ProviderDashboard';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { isAuthenticated, user, initialLoading } = useAuth();

    // Only show loading screen for INITIAL auth check (app startup)
    // Don't show for login/signup operations - that would unmount the navigator
    if (initialLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="mt-4 text-secondary-500">Loading...</Text>
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
            case 'professional':
                return <Stack.Screen name="ProviderDrawer" component={ProviderDrawer} />;
            case 'admin':
                return <Stack.Screen name="AdminDrawer" component={AdminDrawer} />;
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
                    {/* Demo Screens - for previewing without auth */}
                    <Stack.Screen
                        name="DemoClientDashboard"
                        component={ClientDashboard}
                        options={{
                            headerShown: true,
                            title: 'Client Dashboard (Demo)',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="DemoProviderDashboard"
                        component={ProviderDashboard}
                        options={{
                            headerShown: true,
                            title: 'Provider Dashboard (Demo)',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="DemoClientDrawer"
                        component={ClientDrawer}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="DemoProviderDrawer"
                        component={ProviderDrawer}
                        options={{
                            headerShown: false,
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

