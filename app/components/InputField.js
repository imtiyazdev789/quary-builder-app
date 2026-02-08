import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon, { IconNames } from './Icon';
import theme from '../config/theme';
import ErrorText from './ErrorText';

/**
 * InputField Component
 * A reusable text input with label, error handling, optional left icon, and password visibility toggle
 * 
 * @param {string} label - Label text for the input
 * @param {string} value - Current input value
 * @param {function} onChangeText - Callback when text changes
 * @param {string} error - Error message to display
 * @param {string} placeholder - Placeholder text
 * @param {string} keyboardType - Keyboard type (default, email-address, phone-pad, number-pad, url)
 * @param {number} maxLength - Maximum character length
 * @param {boolean} multiline - Enable multiline input
 * @param {number} numberOfLines - Number of lines for multiline
 * @param {boolean} secureTextEntry - Hide text (for passwords)
 * @param {boolean} showPasswordToggle - Show password visibility toggle
 * @param {boolean} autoCapitalize - Auto capitalize setting
 * @param {boolean} editable - Whether the input is editable
 * @param {string} containerClassName - Additional container styles
 * @param {string} leftIcon - Icon name to display on the left (e.g., 'mail', 'person', 'phone', 'lock')
 */
const InputField = ({
    label,
    value,
    onChangeText,
    error,
    placeholder,
    keyboardType = 'default',
    maxLength,
    multiline = false,
    numberOfLines = 1,
    secureTextEntry = false,
    showPasswordToggle = false,
    autoCapitalize = 'sentences',
    editable = true,
    containerClassName = '',
    leftIcon,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isSecure = secureTextEntry && !isPasswordVisible;

    return (
        <View className={`mb-4 ${containerClassName}`}>
            {label && (
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    {label}
                </Text>
            )}
            <View className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <View className="absolute left-3 top-3 z-10">
                        <Icon
                            name={IconNames[leftIcon] || leftIcon}
                            size="lg"
                            color={error ? theme.colors.error[500] : theme.colors.text.tertiary}
                        />
                    </View>
                )}

                <TextInput
                    className={`border rounded-xl py-3 text-base bg-white ${error ? 'border-error-500' : 'border-secondary-200'
                        } ${multiline ? 'h-24' : ''
                        } ${leftIcon ? 'pl-12 pr-4' : 'px-4'
                        } ${(showPasswordToggle || secureTextEntry) ? 'pr-12' : ''
                        } ${!editable ? 'bg-secondary-50 text-secondary-500' : ''
                        }`}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry={isSecure}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                    style={multiline ? { textAlignVertical: 'top' } : {}}
                />

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <TouchableOpacity
                        className="absolute right-3 top-3"
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Icon
                            name={isPasswordVisible ? IconNames.eyeOff : IconNames.eye}
                            size="lg"
                            color={theme.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <ErrorText error={error} />
        </View>
    );
};

export default InputField;

