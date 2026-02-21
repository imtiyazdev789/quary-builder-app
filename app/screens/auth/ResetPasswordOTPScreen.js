import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';
import Icon, { IconNames } from '../../components/Icon';

const ResetPasswordOTPScreen = ({ route, navigation }) => {
    const { email, verificationId, role = 'user' } = route.params || {};
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(600);
    const { verifyPasswordResetOTP, resendPasswordResetOTP, loading } = useAuth();

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
        if (!email) {
            showCustomAlert({
                title: 'Error',
                message: 'Missing email. Please try again.',
                icon: 'close-circle',
                buttons: [{
                    text: 'Go Back',
                    onPress: () => {
                        hideAlert();
                        navigation?.navigate('ForgotPassword');
                    },
                    style: 'primary'
                }],
            });
            return;
        }

        setTimeout(() => {
            showCustomAlert({
                title: 'Code Sent!',
                message: `A 6-digit verification code has been sent to ${email}. Please check your inbox.`,
                icon: 'mail',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }, 300);

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

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            showCustomAlert({
                title: 'Invalid Code',
                message: 'Please enter a valid 6-digit code.',
                icon: 'warning',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            return;
        }

        const result = await verifyPasswordResetOTP(email, otp, verificationId, role);

        if (result.success) {
            showCustomAlert({
                title: 'Check Your Email!',
                message: 'A password reset link has been sent to your email. Please check your inbox and click the link to set your new password.',
                icon: 'mail',
                buttons: [{
                    text: 'Go to Login',
                    onPress: () => {
                        hideAlert();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                    style: 'primary'
                }],
            });
        } else {
            showCustomAlert({
                title: 'Verification Failed',
                message: result.error || 'Invalid code. Please try again.',
                icon: 'close-circle',
                buttons: [{ text: 'Try Again', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    const handleResendOTP = async () => {
        const result = await resendPasswordResetOTP(email, verificationId, role);

        if (result.success) {
            setTimer(600);
            showCustomAlert({
                title: 'Code Resent!',
                message: 'A new verification code has been sent to your email.',
                icon: 'mail',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } else {
            showCustomAlert({
                title: 'Error',
                message: result.error || 'Failed to resend code. Please try again.',
                icon: 'close-circle',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['bottom']}>
            <View className="flex-1 justify-center px-6">
                {/* Premium Header */}
                <View style={s.headerWrap}>
                    <LinearGradient
                        colors={['#fef3c7', '#fde68a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.headerGradient}
                    >
                        <View style={s.logoCircle}>
                            <Icon name={IconNames.lock} size="xxl" color="#d97706" />
                        </View>
                    </LinearGradient>
                    <Text style={s.title}>Verify Code</Text>
                    <Text style={s.subtitle}>
                        We've sent a 6-digit code to
                    </Text>
                    <Text style={s.email}>{email}</Text>
                </View>

                {/* OTP Input */}
                <View style={s.otpContainer}>
                    <TextInput
                        style={[
                            s.otpInput,
                            otp.length === 6 && { borderColor: '#0d9488', borderWidth: 2 },
                        ]}
                        placeholder="000000"
                        placeholderTextColor="#cbd5e1"
                        value={otp}
                        onChangeText={(text) => {
                            const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
                            setOtp(digits);
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                    />
                </View>

                {/* Timer */}
                <View style={s.timerWrap}>
                    {timer > 0 ? (
                        <Text style={s.timerText}>
                            Code expires in{' '}
                            <Text style={s.timerHighlight}>{formatTime(timer)}</Text>
                        </Text>
                    ) : (
                        <Text style={s.timerExpired}>Code has expired</Text>
                    )}
                </View>

                <CustomButton
                    title="Verify Code"
                    onPress={handleVerifyOTP}
                    loading={loading}
                    disabled={otp.length !== 6}
                    variant="primary"
                    size="md"
                />

                <View style={s.resendRow}>
                    <Text style={s.resendText}>Didn't receive code? </Text>
                    <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={loading || timer > 0}
                    >
                        <Text style={[
                            s.resendAction,
                            timer > 0 && { color: '#94a3b8' },
                        ]}>
                            Resend
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={s.backLink}
                    onPress={() => navigation?.navigate('Login')}
                >
                    <Text style={s.backLinkText}>Back to Login</Text>
                </TouchableOpacity>
            </View>

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

const s = StyleSheet.create({
    headerWrap: {
        alignItems: 'center',
        marginBottom: 32,
    },
    headerGradient: {
        width: 88,
        height: 88,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoCircle: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(217,119,6,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
    },
    email: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0d9488',
        marginTop: 2,
    },
    otpContainer: {
        marginBottom: 16,
    },
    otpInput: {
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 18,
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 12,
        backgroundColor: '#f8fafc',
        color: '#0f172a',
    },
    timerWrap: {
        marginBottom: 20,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 14,
        color: '#64748b',
    },
    timerHighlight: {
        fontWeight: '700',
        color: '#0d9488',
    },
    timerExpired: {
        fontSize: 14,
        fontWeight: '600',
        color: '#dc2626',
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    resendText: {
        fontSize: 14,
        color: '#64748b',
    },
    resendAction: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0d9488',
    },
    backLink: {
        marginTop: 20,
        paddingVertical: 8,
    },
    backLinkText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#0d9488',
    },
});

export default ResetPasswordOTPScreen;
