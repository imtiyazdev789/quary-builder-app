import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, Animated } from 'react-native';

/**
 * CustomButton - A reusable button component with press animations
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
    const scaleAnim = useRef(new Animated.Value(1)).current;

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

    // Press animation handlers
    const handlePressIn = () => {
        if (!isDisabled) {
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (!isDisabled) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            activeOpacity={1}
        >
            <Animated.View
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
                        transform: [{ scale: scaleAnim }],
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
            </Animated.View>
        </TouchableOpacity>
    );
};

export default CustomButton;

