import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon, { IconNames } from './Icon';
import theme from '../config/theme';
import ErrorText from './ErrorText';
import { shake } from '../utils/animations';

/**
 * InputField Component — Material Design Floating Label
 * 
 * The label starts as placeholder text inside the input box.
 * On focus or when the field has a value, it animates up to the top-left border
 * with a white background cutout behind it.
 * 
 * @param {string} label - Label text (used as floating label)
 * @param {string} value - Current input value
 * @param {function} onChangeText - Callback when text changes
 * @param {string} error - Error message to display
 * @param {string} placeholder - Optional placeholder (falls back to label)
 * @param {string} keyboardType - Keyboard type
 * @param {number} maxLength - Maximum character length
 * @param {boolean} multiline - Enable multiline input
 * @param {number} numberOfLines - Number of lines for multiline
 * @param {boolean} secureTextEntry - Hide text (for passwords)
 * @param {boolean} showPasswordToggle - Show password visibility toggle
 * @param {boolean} autoCapitalize - Auto capitalize setting
 * @param {boolean} editable - Whether the input is editable
 * @param {string} containerClassName - Additional container styles
 * @param {string} leftIcon - Icon name to display on the left
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
    const [isFocused, setIsFocused] = useState(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    const isSecure = secureTextEntry && !isPasswordVisible;
    const isFloated = isFocused || (value && value.length > 0);

    // Animate label position when focus/value changes
    useEffect(() => {
        Animated.timing(labelAnim, {
            toValue: isFloated ? 1 : 0,
            duration: 180,
            useNativeDriver: false, // We animate layout properties (top, fontSize)
        }).start();
    }, [isFloated]);

    // Trigger shake animation when error appears
    useEffect(() => {
        if (error) {
            shake(shakeAnim).start();
        }
    }, [error]);

    // Animated label styles
    const labelLeftOffset = leftIcon ? 40 : 12;
    const inputHeight = multiline ? 96 : 52;

    const labelTop = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [inputHeight / 2 - 10, -9], // center of input → top border
    });

    const labelFontSize = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
    });

    const labelLeft = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [labelLeftOffset, 10],
    });

    // Label color
    const getLabelColor = () => {
        if (error) return theme.colors.error[500];
        if (isFocused) return theme.colors.primary[500];
        if (value && value.length > 0) return theme.colors.text.secondary || '#64748b';
        return '#94a3b8'; // placeholder gray
    };

    // Border color
    const getBorderColor = () => {
        if (error) return theme.colors.error[500];
        if (isFocused) return theme.colors.primary[500];
        return '#e2e8f0'; // secondary-200
    };

    // Border width (thicker on focus)
    const getBorderWidth = () => {
        if (isFocused || error) return 2;
        return 1.5;
    };

    return (
        <Animated.View
            className={`mb-6 ${containerClassName}`}
            style={{
                transform: [{ translateX: shakeAnim }],
            }}
        >
            <View style={styles.inputContainer}>
                {/* Left Icon */}
                {leftIcon && (
                    <View style={styles.leftIconContainer}>
                        <Icon
                            name={IconNames[leftIcon] || leftIcon}
                            size="lg"
                            color={error ? theme.colors.error[500] : isFocused ? theme.colors.primary[500] : theme.colors.text.tertiary}
                        />
                    </View>
                )}

                {/* TextInput */}
                <TextInput
                    style={[
                        styles.input,
                        {
                            height: multiline ? 96 : 50,
                            borderColor: getBorderColor(),
                            borderWidth: getBorderWidth(),
                            paddingLeft: leftIcon ? 44 : 16,
                            paddingRight: (showPasswordToggle || secureTextEntry) ? 48 : 16,
                            textAlignVertical: multiline ? 'top' : 'center',
                            paddingTop: multiline ? 18 : 10,
                            backgroundColor: !editable ? '#f8fafc' : '#ffffff',
                            color: !editable ? '#94a3b8' : '#1e293b',
                        },
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry={isSecure}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                    placeholder="" // We use the animated label as placeholder
                    placeholderTextColor="#94a3b8"
                />

                {/* Floating Label */}
                {label && (
                    <Animated.View
                        style={[
                            styles.labelWrapper,
                            {
                                top: labelTop,
                                left: labelLeft,
                            },
                        ]}
                        pointerEvents="none"
                    >
                        <View style={[
                            styles.labelBackground,
                            isFloated ? styles.labelBackgroundFloated : null,
                        ]}>
                            <Animated.Text
                                style={[
                                    styles.labelText,
                                    {
                                        fontSize: labelFontSize,
                                        color: getLabelColor(),
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {label}
                            </Animated.Text>
                        </View>
                    </Animated.View>
                )}

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.passwordToggle}
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
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative',
    },
    input: {
        borderRadius: 14,
        fontSize: 16,
        fontWeight: '400',
    },
    leftIconContainer: {
        position: 'absolute',
        left: 14,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 10,
    },
    labelWrapper: {
        position: 'absolute',
        zIndex: 20,
    },
    labelBackground: {
        paddingHorizontal: 0,
    },
    labelBackgroundFloated: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 6,
        borderRadius: 4,
    },
    labelText: {
        fontWeight: '500',
    },
    passwordToggle: {
        position: 'absolute',
        right: 14,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
});

export default InputField;
