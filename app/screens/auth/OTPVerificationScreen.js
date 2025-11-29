import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const OTPVerificationScreen = ({ route, navigation }) => {
    const { emailVerificationId, email, role } = route.params || {};
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const { verifyOtp, resendOtp, loading } = useAuth();

    useEffect(() => {
        if (!emailVerificationId || !email || !role) {
            Alert.alert('Error', 'Missing verification details. Please sign up again.');
            navigation?.navigate('Signup');
            return;
        }

        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        const result = await verifyOtp(emailVerificationId, otp, role);

        if (result.success) {
            Alert.alert('Success', 'Email verified successfully! Please login.', [
                {
                    text: 'OK',
                    onPress: () => navigation?.navigate('Login'),
                },
            ]);
        } else {
            Alert.alert('Verification Failed', result.error);
        }
    };

    const handleResendOtp = async () => {
        const result = await resendOtp(emailVerificationId, role);

        if (result.success) {
            setTimer(600); // Reset timer to 10 minutes
            Alert.alert('Success', 'OTP has been resent to your email');
        } else {
            Alert.alert('Error', result.error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="flex-1 justify-center px-6">
            <View className="mb-8">
                <Text className="text-4xl font-bold text-gray-900 mb-2">
                    Verify Email
                </Text>
                <Text className="text-base text-gray-600 mb-2">
                    We've sent a 6-digit OTP to
                </Text>
                <Text className="text-base font-semibold text-gray-900">
                    {email}
                </Text>
            </View>

            <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base text-center text-2xl font-bold tracking-widest"
                    placeholder="000000"
                    value={otp}
                    onChangeText={(text) => {
                        // Only allow digits and limit to 6
                        const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
                        setOtp(digits);
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                />
            </View>

            <View className="mb-6">
                <Text className="text-center text-sm text-gray-600">
                    {timer > 0 ? (
                        <>
                            OTP expires in{' '}
                            <Text className="font-semibold text-blue-600">
                                {formatTime(timer)}
                            </Text>
                        </>
                    ) : (
                        <Text className="text-red-600 font-semibold">
                            OTP has expired
                        </Text>
                    )}
                </Text>
            </View>

            <TouchableOpacity
                className="bg-blue-600 rounded-lg py-4 items-center mb-4"
                onPress={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-lg font-semibold">
                        Verify OTP
                    </Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
                <Text className="text-gray-600 text-sm">
                    Didn't receive OTP?{' '}
                </Text>
                <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={loading || timer > 0}
                >
                    <Text
                        className={`text-sm font-semibold ${timer > 0 ? 'text-gray-400' : 'text-blue-600'
                            }`}
                    >
                        Resend
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="mt-6"
                onPress={() => navigation?.navigate('Login')}
            >
                <Text className="text-center text-blue-600 font-semibold">
                    Back to Login
                </Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OTPVerificationScreen;

