import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';

const roleOptions = [
    { key: 'user', label: 'Client' },
    { key: 'professional', label: 'Professional' },
];

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [errors, setErrors] = useState({});
    const { requestPasswordReset, loading } = useAuth();

    // Custom Alert State
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

    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRequestReset = async () => {
        if (!validateForm()) {
            return;
        }

        const result = await requestPasswordReset(email, role);

        if (result.success) {
            // Backend returns emailVerificationId directly as data
            navigation.navigate('ResetPasswordOTP', {
                email: email,
                role: role,
                verificationId: result.data, // emailVerificationId is returned directly
            });
        } else {
            // If no account found, suggest checking role
            let errorMessage = result.error || 'Failed to send reset code. Please try again.';
            if (result.error?.toLowerCase().includes('no account')) {
                errorMessage += '\n\nPlease make sure you selected the correct account type (Client or Professional).';
            }
            showCustomAlert({
                title: 'Error',
                message: errorMessage,
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center px-6">
                    <View className="mb-8">
                        <Text className="text-4xl font-bold text-secondary-900 mb-2">
                            Forgot Password?
                        </Text>
                        <Text className="text-base text-secondary-500">
                            Enter your email address and we'll send you a verification code to reset your password.
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
                                        onPress={() => setRole(option.key)}
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

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Email Address
                        </Text>
                        <TextInput
                            className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.email ? 'border-error-500' : 'border-secondary-200'
                                }`}
                            placeholder="Enter your registered email"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                clearError('email');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                        <ErrorText error={errors.email} />
                    </View>

                    <CustomButton
                        title="Send Reset Code"
                        onPress={handleRequestReset}
                        loading={loading}
                        variant="primary"
                        size="md"
                    />

                    <View className="mt-6">
                        <CustomButton
                            title="Back to Login"
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            size="md"
                        />
                    </View>
                </View>
            </ScrollView>

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

export default ForgotPasswordScreen;

