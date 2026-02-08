import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon, { IconNames } from './Icon';
import theme from '../config/theme';

const { width } = Dimensions.get('window');

/**
 * CustomAlert Component
 * 
 * @param {boolean} visible - Controls alert visibility
 * @param {string} title - Alert heading/title
 * @param {string} message - Alert body text
 * @param {string} icon - Icon name from IconNames (e.g., 'checkmark-circle', 'close-circle', 'warning') or legacy emoji
 * @param {Array} buttons - Array of button objects: [{ text: 'OK', onPress: () => {}, style: 'primary|secondary|danger|destructive' }]
 * @param {function} onClose - Called when alert is dismissed
 * 
 * Usage:
 * <CustomAlert
 *   visible={showAlert}
 *   title="Success!"
 *   message="Your action was completed."
 *   icon="checkmark-circle"
 *   buttons={[
 *     { text: 'Cancel', onPress: () => setShowAlert(false), style: 'secondary' },
 *     { text: 'Continue', onPress: handleContinue, style: 'primary' },
 *   ]}
 *   onClose={() => setShowAlert(false)}
 * />
 */

const CustomAlert = ({
    visible = false,
    title = '',
    message = '',
    icon = '',
    buttons = [{ text: 'OK', onPress: () => { }, style: 'primary' }],
    onClose = () => { },
}) => {
    const getButtonStyle = (style) => {
        switch (style) {
            case 'primary':
                return 'bg-primary-600';
            case 'secondary':
                return 'bg-secondary-200';
            case 'danger':
            case 'destructive':
                return 'bg-error-600';
            case 'outline':
                return 'bg-white border-2 border-primary-600';
            default:
                return 'bg-primary-600';
        }
    };

    const getButtonTextStyle = (style) => {
        switch (style) {
            case 'primary':
                return 'text-white';
            case 'secondary':
                return 'text-secondary-700';
            case 'danger':
            case 'destructive':
                return 'text-white';
            case 'outline':
                return 'text-primary-600';
            default:
                return 'text-white';
        }
    };

    // Get icon color based on icon type
    const getIconColor = (iconName) => {
        if (iconName.includes('checkmark') || iconName.includes('success')) {
            return theme.colors.success[500];
        } else if (iconName.includes('close') || iconName.includes('error')) {
            return theme.colors.error[500];
        } else if (iconName.includes('warning')) {
            return theme.colors.warning[500];
        } else if (iconName.includes('mail') || iconName.includes('notification')) {
            return theme.colors.primary[600];
        } else if (iconName.includes('location')) {
            return theme.colors.primary[500];
        }
        return theme.colors.primary[600];
    };

    // Check if icon is a valid IconName (not an emoji)
    const isIconName = icon && IconNames[icon];
    const isEmoji = icon && !isIconName && icon.length <= 2;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
                <View
                    className="bg-white rounded-2xl p-6 w-full max-w-sm"
                    style={{ maxWidth: width - 48 }}
                >
                    {/* Icon */}
                    {icon ? (
                        <View className="items-center mb-4">
                            {isIconName ? (
                                <Icon
                                    name={IconNames[icon]}
                                    size="xxl"
                                    color={getIconColor(icon)}
                                />
                            ) : isEmoji ? (
                                <Text className="text-5xl text-center">{icon}</Text>
                            ) : (
                                <Icon
                                    name={icon}
                                    size="xxl"
                                    color={getIconColor(icon)}
                                />
                            )}
                        </View>
                    ) : null}

                    {/* Title */}
                    {title ? (
                        <Text className="text-xl font-bold text-secondary-900 text-center mb-2">
                            {title}
                        </Text>
                    ) : null}

                    {/* Message */}
                    {message ? (
                        <Text className="text-base text-secondary-600 text-center mb-6 leading-6">
                            {message}
                        </Text>
                    ) : null}

                    {/* Buttons */}
                    <View className={`${buttons.length > 1 ? 'flex-row gap-3' : ''}`}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`${getButtonStyle(button.style)} rounded-xl py-3 px-4 ${buttons.length > 1 ? 'flex-1' : ''
                                    }`}
                                onPress={() => {
                                    button.onPress?.();
                                }}
                                activeOpacity={0.8}
                            >
                                <Text
                                    className={`${getButtonTextStyle(button.style)} text-center font-semibold text-base`}
                                >
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

