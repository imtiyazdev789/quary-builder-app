import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { LocationPickerField, InputField } from '../../components';
import CustomAlert from '../../components/CustomAlert';
import CustomButton from '../../components/CustomButton';
import Icon, { IconNames } from '../../components/Icon';
import theme from '../../config/theme';

const ClientSignupScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Location fields
    const [coordinates, setCoordinates] = useState(null);
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    const { signup, loading } = useAuth();

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
            role: 'user',
            coordinates,
            address: {
                line1: addressLine1,
                line2: addressLine2,
            },
            city,
            state,
            pincode,
            formattedAddress: `${addressLine1}, ${addressLine2}, ${city}, ${state} - ${pincode}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, ''),
        });

        if (result.success && result.data) {
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
                icon: 'close-circle',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 px-6 py-6">
                    {/* Premium Header */}
                    <View style={[s.headerWrap, { paddingTop: 10 }]}>
                        <LinearGradient
                            colors={['#f0fdfa', '#ccfbf1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={s.headerBadge}
                        >
                            <Icon name={IconNames.home} size="xl" color="#0d9488" />
                        </LinearGradient>
                        <View style={{ marginLeft: 14, flex: 1 }}>
                            <Text style={s.title}>Client Registration</Text>
                            <Text style={s.subtitle}>Create your account to get started</Text>
                        </View>
                    </View>

                    {/* Name Fields */}
                    <View style={s.row}>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="First Name"
                                value={firstName}
                                onChangeText={(text) => {
                                    setFirstName(text);
                                    clearError('firstName');
                                }}
                                placeholder="First name"
                                maxLength={20}
                                error={errors.firstName}
                                leftIcon="person"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="Last Name"
                                value={lastName}
                                onChangeText={(text) => {
                                    setLastName(text);
                                    clearError('lastName');
                                }}
                                placeholder="Last name"
                                maxLength={20}
                                error={errors.lastName}
                                leftIcon="person"
                            />
                        </View>
                    </View>

                    <InputField
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            clearError('email');
                        }}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                        leftIcon="mail"
                    />

                    <InputField
                        label="Mobile Number"
                        value={mobileNumber}
                        onChangeText={(text) => {
                            const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
                            setMobileNumber(digits);
                            clearError('mobileNumber');
                        }}
                        placeholder="Enter 10-digit mobile number"
                        keyboardType="phone-pad"
                        maxLength={10}
                        error={errors.mobileNumber}
                        leftIcon="call"
                    />

                    {/* Location Section */}
                    <View style={s.sectionDivider}>
                        <View style={s.sectionLine} />
                        <Text style={s.sectionTitle}>Location Details</Text>
                        <View style={s.sectionLine} />
                    </View>

                    <LocationPickerField
                        onLocationSelect={(locationData) => {
                            setCoordinates(locationData.coordinates);
                            if (locationData.addressLine1) setAddressLine1(locationData.addressLine1);
                            if (locationData.addressLine2) setAddressLine2(locationData.addressLine2);
                            if (locationData.city) setCity(locationData.city);
                            if (locationData.state) setState(locationData.state);
                            if (locationData.pincode) setPincode(locationData.pincode);
                        }}
                    />

                    <InputField
                        label="Address Line 1"
                        value={addressLine1}
                        onChangeText={setAddressLine1}
                        placeholder="Building, Street"
                        leftIcon="location"
                    />

                    <InputField
                        label="Address Line 2"
                        value={addressLine2}
                        onChangeText={setAddressLine2}
                        placeholder="Area, Landmark"
                        leftIcon="location"
                    />

                    <View style={s.row}>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="City"
                                value={city}
                                onChangeText={setCity}
                                placeholder="Enter city"
                                leftIcon="location"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="State"
                                value={state}
                                onChangeText={setState}
                                placeholder="Enter state"
                                leftIcon="location"
                            />
                        </View>
                    </View>

                    <InputField
                        label="Pincode"
                        value={pincode}
                        onChangeText={(text) => setPincode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit pincode"
                        keyboardType="number-pad"
                        maxLength={6}
                        leftIcon="location"
                    />

                    {coordinates && (
                        <View style={s.coordsBadge}>
                            <Icon name={IconNames.location} size="sm" color="#15803d" />
                            <Text style={s.coordsText}>
                                Location: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                            </Text>
                        </View>
                    )}

                    {/* Password Section */}
                    <View style={s.sectionDivider}>
                        <View style={s.sectionLine} />
                        <Text style={s.sectionTitle}>Set Password</Text>
                        <View style={s.sectionLine} />
                    </View>

                    <InputField
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            clearError('password');
                        }}
                        placeholder="Enter password (min 6 characters)"
                        secureTextEntry={!showPassword}
                        showPasswordToggle
                        autoCapitalize="none"
                        error={errors.password}
                        leftIcon="lock"
                    />

                    <InputField
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            clearError('confirmPassword');
                        }}
                        placeholder="Confirm password"
                        secureTextEntry={!showConfirmPassword}
                        showPasswordToggle
                        autoCapitalize="none"
                        error={errors.confirmPassword}
                        leftIcon="lock"
                    />

                    <View style={{ marginTop: 4 }}>
                        <CustomButton
                            title="Create Account"
                            onPress={handleSignup}
                            loading={loading}
                            variant="primary"
                            size="md"
                        />
                    </View>

                    <View style={s.bottomLink}>
                        <Text style={s.bottomLinkText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                            <Text style={s.bottomLinkAction}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={s.backLink}
                        onPress={() => navigation?.navigate('Signup')}
                    >
                        <Text style={s.backLinkText}>← Back to signup options</Text>
                    </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerBadge: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    sectionDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 12,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    coordsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    coordsText: {
        color: '#15803d',
        fontSize: 12,
        marginLeft: 8,
    },
    bottomLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
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
    backLink: {
        marginTop: 12,
        paddingVertical: 12,
    },
    backLinkText: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 13,
    },
});

export default ClientSignupScreen;
