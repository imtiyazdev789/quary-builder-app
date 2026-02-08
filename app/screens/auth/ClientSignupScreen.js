import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    // Field errors state
    const [errors, setErrors] = useState({});

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
            role: 'user', // Always 'user' for client signup
            // Location data
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
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 py-6">
                    {/* Header */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
                                <Icon name={IconNames.home} size="xl" color={theme.colors.primary[500]} />
                            </View>
                            <View>
                                <Text className="text-2xl font-bold text-secondary-900">
                                    Client Registration
                                </Text>
                                <Text className="text-sm text-secondary-500">
                                    Create your account to get started
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View className="flex-row gap-3 mb-4">
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">
                                First Name *
                            </Text>
                            <TextInput
                                className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.firstName ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="First name"
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
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">
                                Last Name *
                            </Text>
                            <TextInput
                                className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.lastName ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Last name"
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
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Email *
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
                            Mobile Number *
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

                    {/* Location Section */}
                    <View className="mb-4">
                        <Text className="text-lg font-bold text-secondary-900 mb-3">
                            Location Details
                        </Text>

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

                        <View className="flex-row gap-3 mb-4">
                            <View className="flex-1">
                                <InputField
                                    label="City"
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="Enter city"
                                    leftIcon="location"
                                />
                            </View>
                            <View className="flex-1">
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
                            <View className="bg-success-50 rounded-xl p-3 mt-2 flex-row items-center">
                                <Icon name={IconNames.location} size="sm" color={theme.colors.success[700]} />
                                <Text className="text-success-700 text-xs ml-2">
                                    Location: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Password *
                        </Text>
                        <View className="relative">
                            <TextInput
                                className={`border rounded-xl px-4 py-3 pr-12 text-base bg-white ${errors.password ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Enter password (min 6 characters)"
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
                                <Icon
                                    name={showPassword ? IconNames.eyeOff : IconNames.eye}
                                    size="lg"
                                    color={theme.colors.text.tertiary}
                                />
                            </TouchableOpacity>
                        </View>
                        <ErrorText error={errors.password} />
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-secondary-800 mb-2">
                            Confirm Password *
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
                                <Icon
                                    name={showConfirmPassword ? IconNames.eyeOff : IconNames.eye}
                                    size="lg"
                                    color={theme.colors.text.tertiary}
                                />
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

                    <TouchableOpacity
                        className="mt-4 py-3"
                        onPress={() => navigation?.navigate('Signup')}
                    >
                        <Text className="text-center text-secondary-500 text-sm">
                            ← Back to signup options
                        </Text>
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

export default ClientSignupScreen;


