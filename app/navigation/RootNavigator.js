import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupSelectionScreen from '../screens/auth/SignupSelectionScreen';
import ClientSignupScreen from '../screens/auth/ClientSignupScreen';
import ProfessionalSignupScreen from '../screens/auth/ProfessionalSignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordOTPScreen from '../screens/auth/ResetPasswordOTPScreen';
import ClientDrawer from './ClientDrawer';
import ProfessionalDrawer from './ProfessionalDrawer';
import AdminDrawer from './AdminDrawer';

// Demo mode imports - for previewing without auth
import ClientDashboard from '../screens/client/ClientDashboard';
import ProfessionalDashboard from '../screens/professional/ProfessionalDashboard';

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
                return <Stack.Screen name="ProfessionalDrawer" component={ProfessionalDrawer} />;
            case 'admin':
                return <Stack.Screen name="AdminDrawer" component={AdminDrawer} />;
            // Fallback for old role names
            case 'client':
                return <Stack.Screen name="ClientDrawer" component={ClientDrawer} />;
            case 'provider':
                return <Stack.Screen name="ProfessionalDrawer" component={ProfessionalDrawer} />;
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
                        component={SignupSelectionScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ClientSignup"
                        component={ClientSignupScreen}
                        options={{
                            headerShown: true,
                            title: 'Client Registration',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="ProfessionalSignup"
                        component={ProfessionalSignupScreen}
                        options={{
                            headerShown: true,
                            title: 'Professional Registration',
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
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPasswordScreen}
                        options={{
                            headerShown: true,
                            title: 'Forgot Password',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="ResetPasswordOTP"
                        component={ResetPasswordOTPScreen}
                        options={{
                            headerShown: true,
                            title: 'Verify Code',
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
                        name="DemoProfessionalDashboard"
                        component={ProfessionalDashboard}
                        options={{
                            headerShown: true,
                            title: 'Professional Dashboard (Demo)',
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
                        name="DemoProfessionalDrawer"
                        component={ProfessionalDrawer}
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

