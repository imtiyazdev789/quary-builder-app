import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';

const SignupScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('user');
    const { signup, loading } = useAuth();

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

    // Clear specific field error when user starts typing
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (firstName.length < 3) {
            newErrors.firstName = 'First name must be at least 3 characters';
        } else if (firstName.length > 20) {
            newErrors.firstName = 'First name must be less than 20 characters';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (lastName.length < 3) {
            newErrors.lastName = 'Last name must be at least 3 characters';
        } else if (lastName.length > 20) {
            newErrors.lastName = 'Last name must be less than 20 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) {
            return;
        }

        const result = await signup({
            firstName,
            lastName,
            email,
            mobileNumber,
            password,
            role,
        });
        if (result.success && result.data) {
            // Navigate to OTP screen
            navigation.navigate('OTPVerification', {
                emailVerificationId: result.data.emailVerificationId,
                email: result.data.email,
                role: result.data.role,
                showSuccessMessage: true,
            });
        } else {
            showCustomAlert({
                title: 'Registration Failed',
                message: result.error || 'Something went wrong. Please try again.',
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
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center px-6 py-8">
                    <View className="mb-6">
                        <Text className="text-4xl font-bold text-secondary-900 mb-2">
                            Create Account
                        </Text>
                        <Text className="text-base text-secondary-500">
                            Sign up to get started
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            I am a
                        </Text>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                className={`flex-1 py-3 px-4 rounded-xl border-2 ${role === 'user'
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'bg-white border-secondary-200'
                                    }`}
                                onPress={() => setRole('user')}
                            >
                                <Text
                                    className={`text-center font-medium ${role === 'user' ? 'text-white' : 'text-secondary-700'
                                        }`}
                                >
                                    Client
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`flex-1 py-3 px-4 rounded-xl border-2 ${role === 'professional'
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'bg-white border-secondary-200'
                                    }`}
                                onPress={() => setRole('professional')}
                            >
                                <Text
                                    className={`text-center font-medium ${role === 'professional' ? 'text-white' : 'text-secondary-700'
                                        }`}
                                >
                                    Professional
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            First Name
                        </Text>
                        <TextInput
                            className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.firstName ? 'border-error-500' : 'border-secondary-200'
                                }`}
                            placeholder="Enter first name"
                            placeholderTextColor="#94a3b8"
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                                clearError('firstName');
                            }}
                            maxLength={20}
                        />
                        <ErrorText error={errors.firstName} />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Last Name
                        </Text>
                        <TextInput
                            className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.lastName ? 'border-error-500' : 'border-secondary-200'
                                }`}
                            placeholder="Enter last name"
                            placeholderTextColor="#94a3b8"
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                                clearError('lastName');
                            }}
                            maxLength={20}
                        />
                        <ErrorText error={errors.lastName} />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Email
                        </Text>
                        <TextInput
                            className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.email ? 'border-error-500' : 'border-secondary-200'
                                }`}
                            placeholder="Enter your email"
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

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Mobile Number
                        </Text>
                        <TextInput
                            className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.mobileNumber ? 'border-error-500' : 'border-secondary-200'
                                }`}
                            placeholder="Enter 10-digit mobile number"
                            placeholderTextColor="#94a3b8"
                            value={mobileNumber}
                            onChangeText={(text) => {
                                const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
                                setMobileNumber(digits);
                                clearError('mobileNumber');
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                        <ErrorText error={errors.mobileNumber} />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className={`border rounded-xl px-4 py-3 pr-12 text-base bg-white ${errors.password ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Enter password"
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

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Confirm Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className={`border rounded-xl px-4 py-3 pr-12 text-base bg-white ${errors.confirmPassword ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Confirm password"
                                placeholderTextColor="#94a3b8"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    clearError('confirmPassword');
                                }}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                className="absolute right-3 top-3"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Text className="text-xl text-secondary-500">
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <ErrorText error={errors.confirmPassword} />
                    </View>

                    <CustomButton
                        title="Create Account"
                        onPress={handleSignup}
                        loading={loading}
                        variant="primary"
                        size="md"
                    />

                    <View className="flex-row justify-center items-center mt-4">
                        <Text className="text-secondary-500 text-sm">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                            <Text className="text-primary-600 font-semibold text-sm">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Custom Alert - for success/API errors only */}
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

export default SignupScreen;
