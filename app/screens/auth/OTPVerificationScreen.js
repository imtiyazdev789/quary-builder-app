import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';

const OTPVerificationScreen = ({ route, navigation }) => {
    const { emailVerificationId, email, role, showSuccessMessage } = route.params || {};
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const { verifyOtp, resendOtp, loading } = useAuth();

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

    useEffect(() => {
        if (!emailVerificationId || !email || !role) {
            showCustomAlert({
                title: 'Error',
                message: 'Missing verification details. Please sign up again.',
                icon: '❌',
                buttons: [{
                    text: 'Go Back',
                    onPress: () => {
                        hideAlert();
                        navigation?.navigate('Signup');
                    },
                    style: 'primary'
                }],
            });
            return;
        }

        // Show success message if coming from signup
        if (showSuccessMessage) {
            setTimeout(() => {
                showCustomAlert({
                    title: 'OTP Sent!',
                    message: `A 6-digit verification code has been sent to ${email}. Please check your inbox.`,
                    icon: '📧',
                    buttons: [{
                        text: 'OK',
                        onPress: hideAlert,
                        style: 'primary'
                    }],
                });
            }, 300);
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
            showCustomAlert({
                title: 'Invalid OTP',
                message: 'Please enter a valid 6-digit OTP.',
                icon: '⚠️',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            return;
        }

        const result = await verifyOtp(emailVerificationId, otp, role);

        if (result.success) {
            showCustomAlert({
                title: 'Verified!',
                message: 'Your email has been verified successfully! You can now login to your account.',
                icon: '✅',
                buttons: [{
                    text: 'Login Now',
                    onPress: () => {
                        hideAlert();
                        setTimeout(() => {
                            navigation?.navigate('Login');
                        }, 100);
                    },
                    style: 'primary'
                }],
            });
        } else {
            showCustomAlert({
                title: 'Verification Failed',
                message: result.error || 'Invalid OTP. Please try again.',
                icon: '❌',
                buttons: [{ text: 'Try Again', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    const handleResendOtp = async () => {
        const result = await resendOtp(emailVerificationId, role);

        if (result.success) {
            setTimer(600); // Reset timer to 10 minutes
            showCustomAlert({
                title: 'OTP Resent!',
                message: 'A new OTP has been sent to your email.',
                icon: '📧',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } else {
            showCustomAlert({
                title: 'Error',
                message: result.error || 'Failed to resend OTP. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
            <View className="flex-1 justify-center px-6">
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-secondary-900 mb-2">
                        Verify Email
                    </Text>
                    <Text className="text-base text-secondary-500 mb-2">
                        We've sent a 6-digit OTP to
                    </Text>
                    <Text className="text-base font-semibold text-primary-600">
                        {email}
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-secondary-800 mb-2">
                        Enter OTP
                    </Text>
                    <TextInput
                        className="border border-secondary-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-widest bg-white"
                        placeholder="000000"
                        placeholderTextColor="#94a3b8"
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
                    <Text className="text-center text-sm text-secondary-500">
                        {timer > 0 ? (
                            <>
                                OTP expires in{' '}
                                <Text className="font-semibold text-primary-600">
                                    {formatTime(timer)}
                                </Text>
                            </>
                        ) : (
                            <Text className="text-error-600 font-semibold">
                                OTP has expired
                            </Text>
                        )}
                    </Text>
                </View>

                <CustomButton
                    title="Verify OTP"
                    onPress={handleVerifyOtp}
                    loading={loading}
                    disabled={otp.length !== 6}
                    variant="primary"
                    size="md"
                />

                <View className="flex-row justify-center items-center">
                    <Text className="text-secondary-500 text-sm">
                        Didn't receive OTP?{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={handleResendOtp}
                        disabled={loading || timer > 0}
                    >
                        <Text
                            className={`text-sm font-semibold ${timer > 0 ? 'text-secondary-400' : 'text-primary-600'
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
                    <Text className="text-center text-primary-600 font-semibold">
                        Back to Login
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Custom Alert */}
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

export default OTPVerificationScreen;
