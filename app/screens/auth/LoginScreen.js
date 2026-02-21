import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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

const LoginScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const { login, loading } = useAuth();

    const [errors, setErrors] = useState({});

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

    const credentialLabel = role === 'admin' ? 'Username' : 'Email';
    const credentialPlaceholder =
        role === 'admin'
            ? 'Enter admin username'
            : role === 'professional'
                ? 'Enter representative email'
                : 'Enter your email';
    const credentialKeyboardType = role === 'admin' ? 'default' : 'email-address';

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
                icon: 'close-circle',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 justify-center px-6">
                    {/* Premium Header */}
                    <View style={s.headerWrap}>
                        <LinearGradient
                            colors={['#f0fdfa', '#ccfbf1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={s.headerGradient}
                        >
                            <View style={s.logoCircle}>
                                <Icon name={IconNames.lock} size="xxl" color="#0d9488" />
                            </View>
                        </LinearGradient>
                        <Text style={s.title}>Welcome Back</Text>
                        <Text style={s.subtitle}>Sign in to your BuildQuery account</Text>
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
                                        onPress={() => {
                                            setRole(option.key);
                                            clearError('identifier');
                                        }}
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

                    {/* Floating Label Input Fields */}
                    <InputField
                        label={credentialLabel}
                        value={identifier}
                        onChangeText={(text) => {
                            setIdentifier(text);
                            clearError('identifier');
                        }}
                        placeholder={credentialPlaceholder}
                        keyboardType={credentialKeyboardType}
                        autoCapitalize="none"
                        error={errors.identifier}
                        leftIcon={role === 'admin' ? 'person' : 'mail'}
                    />

                    <InputField
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            clearError('password');
                        }}
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        showPasswordToggle
                        autoCapitalize="none"
                        error={errors.password}
                        leftIcon="lock"
                    />

                    <TouchableOpacity
                        style={s.forgotLink}
                        onPress={() => navigation?.navigate('ForgotPassword')}
                    >
                        <Text style={s.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <CustomButton
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        variant="primary"
                        size="md"
                    />

                    {/* Sign Up Link */}
                    <View style={s.bottomLink}>
                        <Text style={s.bottomLinkText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation?.navigate('Signup')}>
                            <Text style={s.bottomLinkAction}>Sign Up</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(13,148,136,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        fontWeight: '400',
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
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginTop: -4,
    },
    forgotText: {
        color: '#0d9488',
        fontSize: 13,
        fontWeight: '600',
    },
    bottomLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    bottomLinkText: {
        color: '#64748b',
        fontSize: 14,
    },
    bottomLinkAction: {
        color: '#0d9488',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default LoginScreen;
