import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../../components';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';
import Icon, { IconNames } from '../../components/Icon';

const roleOptions = [
    { key: 'user', label: 'Client', icon: 'home' },
    { key: 'professional', label: 'Professional', icon: 'briefcase' },
];

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [errors, setErrors] = useState({});
    const { requestPasswordReset, loading } = useAuth();

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
            navigation.navigate('ResetPasswordOTP', {
                email: email,
                role: role,
                verificationId: result.data,
            });
        } else {
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
                        <Text style={s.title}>Forgot Password?</Text>
                        <Text style={s.subtitle}>
                            Enter your email and we'll send you a verification code to reset your password.
                        </Text>
                    </View>

                    {/* Role Selector */}
                    <View style={s.roleSection}>
                        <Text style={s.roleLabel}>I am a</Text>
                        <View style={s.roleRow}>
                            {roleOptions.map((option) => {
                                const isActive = role === option.key;
                                return (
                                    <TouchableOpacity
                                        key={option.key}
                                        style={[
                                            s.roleChip,
                                            isActive && s.roleChipActive,
                                        ]}
                                        onPress={() => setRole(option.key)}
                                        activeOpacity={0.7}
                                    >
                                        <Icon
                                            name={IconNames[option.icon]}
                                            size="sm"
                                            color={isActive ? '#ffffff' : '#64748b'}
                                        />
                                        <Text style={[
                                            s.roleChipText,
                                            isActive && s.roleChipTextActive,
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <InputField
                        label="Email Address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            clearError('email');
                        }}
                        placeholder="Enter your registered email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                        leftIcon="mail"
                    />

                    <View style={{ marginTop: 4 }}>
                        <CustomButton
                            title="Send Reset Code"
                            onPress={handleRequestReset}
                            loading={loading}
                            variant="primary"
                            size="md"
                        />
                    </View>

                    <View style={{ marginTop: 16 }}>
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
        fontSize: 26,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 12,
    },
    roleSection: {
        marginBottom: 8,
    },
    roleLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 10,
        marginLeft: 2,
    },
    roleRow: {
        flexDirection: 'row',
        gap: 10,
    },
    roleChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    roleChipActive: {
        backgroundColor: '#0d9488',
        borderColor: '#0d9488',
    },
    roleChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    roleChipTextActive: {
        color: '#ffffff',
    },
});

export default ForgotPasswordScreen;
