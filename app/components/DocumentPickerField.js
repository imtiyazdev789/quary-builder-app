import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import ErrorText from './ErrorText';
import Icon, { IconNames } from './Icon';
import theme from '../config/theme';

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
                <Text className="text-sm font-semibold text-secondary-800 mb-2 ml-1">
                    {label} {required && <Text className="text-error-500">*</Text>}
                </Text>
            )}
            <TouchableOpacity
                className={`border rounded-2xl px-4 py-4 flex-row items-center border-dashed ${error ? 'border-error-500 bg-error-50' : 'border-secondary-300 bg-secondary-50'
                    } ${document ? 'bg-primary-50 border-primary-400 border-solid' : ''} shadow-sm`}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                {showPreview && isImage && document ? (
                    <View className="items-center w-full">
                        <View className="relative">
                            <Image
                                source={{ uri: document.uri }}
                                className="w-24 h-24 rounded-2xl mb-2 border-2 border-primary-200"
                            />
                            <View className="absolute -right-2 -top-2 bg-primary-600 rounded-full p-1 border-2 border-white">
                                <Icon name={IconNames.checkmark} size="xs" color="white" />
                            </View>
                        </View>
                        <Text className="text-xs font-bold text-primary-600 uppercase tracking-wider">Tap to change</Text>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between w-full">
                        <View className="flex-row items-center flex-1">
                            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${document ? 'bg-primary-100' : 'bg-secondary-200'}`}>
                                <Icon
                                    name={document ? IconNames.documentText : (accept === 'image' ? IconNames.image : IconNames.document)}
                                    size="lg"
                                    color={document ? theme.colors.primary[600] : theme.colors.secondary[500]}
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className={`text-sm font-bold ${document ? 'text-primary-800' : 'text-secondary-600'}`}
                                    numberOfLines={1}
                                >
                                    {document ? document.name || 'File selected' : placeholder}
                                </Text>
                                <Text className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest mt-0.5">
                                    {document ? 'Ready to upload' : `Supports ${getAcceptText()}`}
                                </Text>
                            </View>
                        </View>
                        <Icon name={IconNames.upload} size="md" color={document ? theme.colors.primary[600] : theme.colors.secondary[300]} />
                    </View>
                )}
            </TouchableOpacity>
            <ErrorText error={error} />
        </View>
    );
};

export default DocumentPickerField;

