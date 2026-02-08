import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ErrorText, Icon, IconNames } from '../../../components';

const Step7PasswordDeclaration = ({
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    declarationAccepted,
    setDeclarationAccepted,
    errors,
    clearError,
}) => {
    const handleDeclarationToggle = () => {
        setDeclarationAccepted((prev) => !prev);
        clearError('declaration');
    };

    return (
        <View>
            <Text className="text-xl font-bold text-secondary-900 mb-4">Create Password</Text>

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">Password *</Text>
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
                            color="#64748b"
                        />
                    </TouchableOpacity>
                </View>
                <ErrorText error={errors.password} />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-medium text-secondary-800 mb-2">Confirm Password *</Text>
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
                            color="#64748b"
                        />
                    </TouchableOpacity>
                </View>
                <ErrorText error={errors.confirmPassword} />
            </View>

            <TouchableOpacity
                className="flex-row items-start mb-6"
                onPress={handleDeclarationToggle}
            >
                <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${declarationAccepted ? 'bg-primary-600 border-primary-600' : 'border-secondary-300'
                    }`}>
                    {declarationAccepted && <Icon name={IconNames.checkmark} size="xs" color="white" />}
                </View>
                <Text className="flex-1 text-sm text-secondary-600">
                    I hereby declare that all information provided is true and accurate to the best of my knowledge.
                    I agree to the Terms of Service and Privacy Policy.
                </Text>
            </TouchableOpacity>
            <ErrorText error={errors.declaration} />

            <View className="bg-primary-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center mb-2">
                    <Icon name={IconNames.information} size="sm" color="#0d9488" style={{ marginRight: 8 }} />
                    <Text className="text-sm text-primary-800 font-medium">What happens next?</Text>
                </View>
                <Text className="text-xs text-primary-700 leading-5">
                    • You'll receive an OTP on your email for verification{'\n'}
                    • Our team will review your documents{'\n'}
                    • Once approved, you can start receiving project requests
                </Text>
            </View>
        </View>
    );
};

export default Step7PasswordDeclaration;

