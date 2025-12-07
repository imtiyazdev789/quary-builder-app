import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * CustomAlert Component
 * 
 * @param {boolean} visible - Controls alert visibility
 * @param {string} title - Alert heading/title
 * @param {string} message - Alert body text
 * @param {string} icon - Optional emoji/icon to display (e.g., '📧', '✅', '❌')
 * @param {Array} buttons - Array of button objects: [{ text: 'OK', onPress: () => {}, style: 'primary|secondary|danger' }]
 * @param {function} onClose - Called when alert is dismissed
 * 
 * Usage:
 * <CustomAlert
 *   visible={showAlert}
 *   title="Success!"
 *   message="Your action was completed."
 *   icon="✅"
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
                return 'text-white';
            case 'outline':
                return 'text-primary-600';
            default:
                return 'text-white';
        }
    };

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
                        <Text className="text-5xl text-center mb-4">{icon}</Text>
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

