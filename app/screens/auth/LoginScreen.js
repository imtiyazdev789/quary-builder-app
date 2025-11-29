import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'professional'
    const { login, loading } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!role) {
            Alert.alert('Error', 'Please select a role');
            return;
        }

        const result = await login(email, password, role);

        if (!result.success) {
            Alert.alert('Login Failed', result.error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center px-6 py-12">
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-base text-gray-600">
                        Sign in to continue
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
                        Email
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder={role === 'professional' ? 'Enter representative email' : 'Enter your email'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Password
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 rounded-lg py-4 items-center mb-4"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-semibold">
                            Sign In
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center items-center mt-4">
                    <Text className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigation?.navigate('Signup')}>
                        <Text className="text-blue-600 font-semibold text-sm">
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;

