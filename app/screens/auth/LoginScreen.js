import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';

const roleOptions = [
    { key: 'user', label: 'Client' },
    { key: 'professional', label: 'Professional' },
    { key: 'admin', label: 'Admin' },
];

const LoginScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user'); // 'user' | 'professional' | 'admin'
    const { login, loading } = useAuth();

    // Field errors state
    const [errors, setErrors] = useState({});

    // Custom Alert State (for API errors only)
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    const showCustomAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    // Dynamic labels based on role
    const credentialLabel = role === 'admin' ? 'Username' : 'Email';
    const credentialPlaceholder =
        role === 'admin'
            ? 'Enter admin username'
            : role === 'professional'
                ? 'Enter representative email'
                : 'Enter your email';
    const credentialKeyboardType = role === 'admin' ? 'default' : 'email-address';

    // Clear specific field error when user starts typing
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!identifier.trim()) {
            newErrors.identifier = `${credentialLabel} is required`;
        } else if (role !== 'admin') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) {
                newErrors.identifier = 'Please enter a valid email address';
            }
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        const result = await login(identifier, password, role);

        if (!result.success) {
            showCustomAlert({
                title: 'Login Failed',
                message: result.error || 'Invalid credentials. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    // Error text component
    const ErrorText = ({ error }) => {
        if (!error) return null;
        return (
            <Text className="text-error-500 text-xs mt-1 ml-1">
                {error}
            </Text>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center px-6">
                    <View className="mb-8">
                        <Text className="text-4xl font-bold text-secondary-900 mb-2">
                            Welcome Back
                        </Text>
                        <Text className="text-base text-secondary-500">
                            Sign in to continue
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            I am a
                        </Text>
                        <View className="flex-row gap-2">
                            {roleOptions.map((option) => {
                                const isActive = role === option.key;
                                return (
                                    <TouchableOpacity
                                        key={option.key}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 ${isActive
                                            ? 'bg-primary-600 border-primary-600'
                                            : 'bg-white border-secondary-200'
                                            }`}
                                        onPress={() => {
                                            setRole(option.key);
                                            clearError('identifier');
                                        }}
                                    >
                                        <Text
                                            className={`text-center font-medium ${isActive ? 'text-white' : 'text-secondary-700'
                                                }`}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            {credentialLabel}
                        </Text>
                        <TextInput
                            className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.identifier ? 'border-error-500' : 'border-secondary-200'
                                }`}
                            placeholder={credentialPlaceholder}
                            placeholderTextColor="#94a3b8"
                            value={identifier}
                            onChangeText={(text) => {
                                setIdentifier(text);
                                clearError('identifier');
                            }}
                            keyboardType={credentialKeyboardType}
                            autoCapitalize="none"
                            autoComplete={role === 'admin' ? 'off' : 'email'}
                        />
                        <ErrorText error={errors.identifier} />
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className={`border rounded-xl px-4 py-3 pr-12 text-base bg-white ${errors.password ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Enter your password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    clearError('password');
                                }}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                className="absolute right-3 top-3"
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text className="text-xl text-secondary-500">
                                    {showPassword ? '🙈' : '👁️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <ErrorText error={errors.password} />
                    </View>

                    <CustomButton
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        variant="primary"
                        size="md"
                    />

                    <View className="flex-row justify-center items-center mt-4">
                        <Text className="text-secondary-500 text-sm">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation?.navigate('Signup')}>
                            <Text className="text-primary-600 font-semibold text-sm">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Demo Mode Section - Remove in production */}
                    {/* <View className="mt-8 pt-6 border-t border-secondary-200">
                        <Text className="text-center text-secondary-400 text-xs mb-3 uppercase tracking-wider">
                            Demo Mode
                        </Text>
                        <View className="flex-row gap-2">
                            <View className="flex-1">
                                <CustomButton
                                    title="Client App"
                                    onPress={() => navigation?.navigate('DemoClientDrawer')}
                                    variant="secondary"
                                    size="sm"
                                />
                            </View>
                            <View className="flex-1">
                                <CustomButton
                                    title="Provider App"
                                    onPress={() => navigation?.navigate('DemoProviderDrawer')}
                                    variant="secondary"
                                    size="sm"
                                />
                            </View>
                        </View>
                    </View> */}
                </View>
            </ScrollView>

            {/* Custom Alert - for API errors only */}
            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
        </SafeAreaView>
    );
};

export default LoginScreen;
