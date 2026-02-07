import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import ErrorText from './ErrorText';

/**
 * DocumentPickerField Component
 * A field for uploading documents or images
 * 
 * @param {string} label - Label text for the field
 * @param {object} document - Selected document object with { uri, name, mimeType }
 * @param {function} onSelect - Callback when document is selected
 * @param {string} error - Error message to display
 * @param {boolean} required - Show required indicator
 * @param {string} accept - What to accept: 'document', 'image', or 'both' (default)
 * @param {string} placeholder - Custom placeholder text
 * @param {boolean} showPreview - Show image preview for images (default: false)
 */
const DocumentPickerField = ({
    label,
    document,
    onSelect,
    error,
    required = false,
    accept = 'both',
    placeholder = 'Tap to upload',
    showPreview = false,
}) => {
    const pickDocument = async () => {
        try {
            let mimeTypes;
            switch (accept) {
                case 'document':
                    mimeTypes = ['application/pdf'];
                    break;
                case 'image':
                    mimeTypes = ['image/*'];
                    break;
                default:
                    mimeTypes = ['application/pdf', 'image/*'];
            }

            const result = await DocumentPicker.getDocumentAsync({
                type: mimeTypes,
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                onSelect(result.assets[0]);
            }
        } catch (error) {
            console.error('Document picker error:', error);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission denied for photo library');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                onSelect(result.assets[0]);
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    const handlePress = () => {
        if (accept === 'image') {
            pickImage();
        } else {
            pickDocument();
        }
    };

    const getAcceptText = () => {
        switch (accept) {
            case 'document':
                return 'PDF';
            case 'image':
                return 'Image';
            default:
                return 'PDF/Image';
        }
    };

    const isImage = document && (
        document.mimeType?.startsWith('image/') ||
        document.uri?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    {label} {required && <Text className="text-error-500">*</Text>}
                </Text>
            )}
            <TouchableOpacity
                className={`border rounded-xl px-4 py-4 ${error ? 'border-error-500' : 'border-secondary-200'
                    } ${document ? 'bg-primary-50 border-primary-300' : 'bg-white'}`}
                onPress={handlePress}
            >
                {showPreview && isImage && document ? (
                    <View className="items-center">
                        <Image
                            source={{ uri: document.uri }}
                            className="w-24 h-24 rounded-lg mb-2"
                        />
                        <Text className="text-xs text-primary-600">Tap to change</Text>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <Text className="text-2xl mr-3">{document ? '✅' : '📄'}</Text>
                            <Text
                                className={`text-sm flex-1 ${document ? 'text-primary-700' : 'text-secondary-500'}`}
                                numberOfLines={1}
                            >
                                {document ? document.name || 'Document selected' : placeholder}
                            </Text>
                        </View>
                        <Text className="text-secondary-400 text-xs">{getAcceptText()}</Text>
                    </View>
                )}
            </TouchableOpacity>
            <ErrorText error={error} />
        </View>
    );
};

export default DocumentPickerField;

