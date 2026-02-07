import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

/**
 * CustomButton - A reusable button component
 * 
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {boolean} loading - Show loading indicator
 * @param {boolean} disabled - Disable button
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} icon - Optional icon to show before text
 * @param {object} style - Additional container styles
 * @param {object} textStyle - Additional text styles
 */
const CustomButton = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'md',
    icon,
    style,
    textStyle,
}) => {
    // Size configurations
    const sizeConfig = {
        sm: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            fontSize: 14,
            height: 40,
        },
        md: {
            paddingVertical: 14,
            paddingHorizontal: 20,
            fontSize: 16,
            height: 50,
        },
        lg: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            fontSize: 18,
            height: 56,
        },
    };

    // Variant configurations
    const variantConfig = {
        primary: {
            backgroundColor: disabled ? '#94a3b8' : '#0d9488',
            textColor: '#ffffff',
            borderColor: 'transparent',
            borderWidth: 0,
        },
        secondary: {
            backgroundColor: disabled ? '#e2e8f0' : '#f1f5f9',
            textColor: disabled ? '#94a3b8' : '#1e293b',
            borderColor: 'transparent',
            borderWidth: 0,
        },
        outline: {
            backgroundColor: 'transparent',
            textColor: disabled ? '#94a3b8' : '#0d9488',
            borderColor: disabled ? '#cbd5e1' : '#0d9488',
            borderWidth: 1.5,
        },
        danger: {
            backgroundColor: disabled ? '#fca5a5' : '#ef4444',
            textColor: '#ffffff',
            borderColor: 'transparent',
            borderWidth: 0,
        },
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;
    const currentVariant = variantConfig[variant] || variantConfig.primary;

    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                {
                    backgroundColor: currentVariant.backgroundColor,
                    borderColor: currentVariant.borderColor,
                    borderWidth: currentVariant.borderWidth,
                    borderRadius: 12,
                    height: currentSize.height,
                    paddingHorizontal: currentSize.paddingHorizontal,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={currentVariant.textColor}
                    size="small"
                />
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    {icon && (
                        <Text style={{ marginRight: 8, fontSize: currentSize.fontSize }}>
                            {icon}
                        </Text>
                    )}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                            {
                                color: currentVariant.textColor,
                                fontSize: currentSize.fontSize,
                                fontWeight: '600',
                                textAlign: 'center',
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;

