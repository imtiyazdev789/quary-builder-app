import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const SignupScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const { signup, loading } = useAuth();

    const validateForm = () => {
        if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return false;
        }

        if (firstName.length < 3 || firstName.length > 20) {
            Alert.alert('Error', 'First name must be between 3 and 20 characters');
            return false;
        }

        if (lastName.length < 3 || lastName.length > 20) {
            Alert.alert('Error', 'Last name must be between 3 and 20 characters');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
            Alert.alert('Error', 'Mobile number must be exactly 10 digits');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        return true;
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

        if (result.success) {
            // Navigate to OTP verification screen
            navigation?.navigate('OTPVerification', {
                emailVerificationId: result.data.emailVerificationId,
                email: result.data.email,
                role: result.data.role,
            });
        } else {
            Alert.alert('Registration Failed', result.error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center px-6 py-8">
                <View className="mb-6">
                    <Text className="text-4xl font-bold text-gray-900 mb-2">
                        Create Account
                    </Text>
                    <Text className="text-base text-gray-600">
                        Sign up to get started
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        I am a
                    </Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            className={`flex-1 py-3 px-4 rounded-lg border-2 ${role === 'user'
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-white border-gray-300'
                                }`}
                            onPress={() => setRole('user')}
                        >
                            <Text
                                className={`text-center font-medium ${role === 'user' ? 'text-white' : 'text-gray-700'
                                    }`}
                            >
                                Client
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-3 px-4 rounded-lg border-2 ${role === 'professional'
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-white border-gray-300'
                                }`}
                            onPress={() => setRole('professional')}
                        >
                            <Text
                                className={`text-center font-medium ${role === 'professional' ? 'text-white' : 'text-gray-700'
                                    }`}
                            >
                                Professional
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        First Name
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Enter first name"
                        value={firstName}
                        onChangeText={setFirstName}
                        maxLength={20}
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Last Name
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Enter last name"
                        value={lastName}
                        onChangeText={setLastName}
                        maxLength={20}
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Email
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Enter 10-digit mobile number"
                        value={mobileNumber}
                        onChangeText={(text) => {
                            // Only allow digits and limit to 10
                            const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
                            setMobileNumber(digits);
                        }}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Password
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 rounded-lg py-4 items-center mb-4"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-semibold">
                            Sign Up
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center items-center mt-4">
                    <Text className="text-gray-600 text-sm">
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                        <Text className="text-blue-600 font-semibold text-sm">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignupScreen;

