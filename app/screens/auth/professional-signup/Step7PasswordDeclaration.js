import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ErrorText, InputField, Icon, IconNames } from '../../../components';

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
            <View className="mb-6">
                <Text className="text-2xl font-bold text-secondary-900 mb-1">
                    Security & Declaration
                </Text>
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

            <TouchableOpacity
                className="flex-row items-start mb-6"
                onPress={handleDeclarationToggle}
                activeOpacity={0.7}
            >
                <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: declarationAccepted ? '#0d9488' : '#cbd5e1',
                    backgroundColor: declarationAccepted ? '#0d9488' : '#ffffff',
                    marginRight: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {declarationAccepted && <Icon name={IconNames.checkmark} size="xs" color="white" />}
                </View>
                <Text className="flex-1 text-sm text-secondary-600" style={{ lineHeight: 20 }}>
                    I hereby declare that all information provided is true and accurate to the best of my knowledge.
                    I agree to the Terms of Service and Privacy Policy.
                </Text>
            </TouchableOpacity>
            <ErrorText error={errors.declaration} />

            <View style={{
                backgroundColor: '#f0fdfa',
                borderRadius: 14,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#ccfbf1',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name={IconNames.information} size="sm" color="#0d9488" style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 14, color: '#115e59', fontWeight: '600' }}>What happens next?</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#0f766e', lineHeight: 20 }}>
                    • You'll receive an OTP on your email for verification{'\n'}
                    • Our team will review your documents{'\n'}
                    • Once approved, you can start receiving project requests
                </Text>
            </View>
        </View>
    );
};

export default Step7PasswordDeclaration;
