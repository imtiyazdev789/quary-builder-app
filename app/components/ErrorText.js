import React from 'react';
import { Text } from 'react-native';

/**
 * ErrorText Component
 * Displays validation error message below form fields
 * 
 * @param {string} error - The error message to display
 */
const ErrorText = ({ error }) => {
    if (!error) return null;
    return (
        <Text className="text-error-500 text-xs mt-1 ml-1">
            {error}
        </Text>
    );
};

export default ErrorText;

