import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ErrorText from './ErrorText';

/**
 * DropdownSelector Component
 * A chip/button-based selector for choosing from multiple options
 * 
 * @param {string} label - Label text for the selector
 * @param {Array} options - Array of options with { key, label } structure
 * @param {string} selected - Currently selected option key
 * @param {function} onSelect - Callback when option is selected (receives key)
 * @param {string} error - Error message to display
 * @param {boolean} multiple - Allow multiple selections (returns array)
 * @param {Array} selectedMultiple - Array of selected keys (for multiple mode)
 * @param {string} variant - Style variant: 'chips' (default) or 'list'
 */
const DropdownSelector = ({
    label,
    options,
    selected,
    onSelect,
    error,
    multiple = false,
    selectedMultiple = [],
    variant = 'chips',
}) => {
    const isSelected = (key) => {
        if (multiple) {
            return selectedMultiple.includes(key);
        }
        return selected === key;
    };

    const handleSelect = (key) => {
        if (multiple) {
            if (selectedMultiple.includes(key)) {
                onSelect(selectedMultiple.filter(k => k !== key));
            } else {
                onSelect([...selectedMultiple, key]);
            }
        } else {
            onSelect(key);
        }
    };

    if (variant === 'list') {
        return (
            <View className="mb-4">
                {label && (
                    <Text className="text-sm font-semibold text-secondary-800 mb-2 ml-1">
                        {label}
                    </Text>
                )}
                <View className={`border rounded-2xl overflow-hidden ${error ? 'border-error-500' : 'border-secondary-200'} bg-white`}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={option.key}
                            className={`py-4 px-5 flex-row items-center justify-between ${isSelected(option.key) ? 'bg-primary-50' : 'bg-white'
                                } ${index < options.length - 1 ? 'border-b border-secondary-100' : ''}`}
                            onPress={() => handleSelect(option.key)}
                        >
                            <Text className={`text-sm ${isSelected(option.key) ? 'text-primary-700 font-bold' : 'text-secondary-700'}`}>
                                {option.label}
                            </Text>
                            {isSelected(option.key) && (
                                <View className="w-5 h-5 rounded-full bg-primary-600 items-center justify-center">
                                    <Text className="text-white text-[10px]">✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
                <ErrorText error={error} />
            </View>
        );
    }

    // Default: chips variant
    return (
        <View className="mb-4">
            {label && (
                <Text className="text-sm font-semibold text-secondary-800 mb-2 ml-1">
                    {label}
                </Text>
            )}
            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        className={`py-2.5 px-5 rounded-xl border ${isSelected(option.key)
                            ? 'bg-primary-600 border-primary-600'
                            : 'bg-white border-secondary-200'
                            }`}
                        onPress={() => handleSelect(option.key)}
                        activeOpacity={0.7}
                    >
                        <Text className={`text-sm font-medium ${isSelected(option.key) ? 'text-white' : 'text-secondary-600'}`}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <ErrorText error={error} />
        </View>
    );
};

export default DropdownSelector;

