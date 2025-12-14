import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
    InputField,
    DropdownSelector,
    DatePickerField,
    CustomButton,
    CustomAlert,
    ErrorText,
} from '../../components';
import { BUSINESS_TYPES } from '../auth/professional-signup/constants';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

const UpdateProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [errors, setErrors] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    // Form fields
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [dateOfEstablishment, setDateOfEstablishment] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [representativeEmail, setRepresentativeEmail] = useState('');
    const [representativeMobile, setRepresentativeMobile] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [representativePhoto, setRepresentativePhoto] = useState(null);
    const [photoUri, setPhotoUri] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const response = await api.get('/api/professionaldetails');

            if (response.data.success && response.data.data) {
                const profile = response.data.data;

                // Populate form fields
                setBusinessName(profile.businessName || '');
                setBusinessType(profile.businessType || '');
                setDateOfEstablishment(profile.dateOfEstablishment ? new Date(profile.dateOfEstablishment).toISOString().split('T')[0] : '');
                setWebsiteUrl(profile.websiteUrl || '');
                setCity(profile.city || '');
                setState(profile.state || '');
                setPincode(profile.pincode || '');
                setAddressLine1(profile.registeredAddress?.line1 || '');
                setRepresentativeName(profile.representativeName || '');
                setRepresentativeEmail(profile.representativeEmail || '');
                setRepresentativeMobile(profile.representativeMobile || '');
                setShortDescription(profile.shortDescription || '');

                if (profile.representativePhoto) {
                    console.log('Photo URL from fetch:', profile.representativePhoto);
                    const base = process.env.EXPO_PUBLIC_API_BASE_URL || '';
                    const normalizedBase =
                        base.includes('localhost') && Platform.OS === 'android'
                            ? base.replace('localhost', '10.0.2.2')
                            : base;
                    // Ensure URL is complete (add base URL if it's a relative path)
                    let photoUrl = profile.representativePhoto.startsWith('http')
                        ? profile.representativePhoto
                        : `${normalizedBase}${profile.representativePhoto.replace(/^\//, '')}`;
                    // Add cache buster to ensure fresh image
                    photoUrl += (photoUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;
                    console.log('Setting photo URI to:', photoUrl);
                    setPhotoUri(photoUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load profile. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setFetching(false);
        }
    };

    const pickImage = async () => {
        if (!isEditing) return;
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert({
                title: 'Permission Denied',
                message: 'Please allow access to your photo library.',
                icon: '📷',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const selectedImage = result.assets[0];
            console.log('Selected image:', selectedImage.uri);
            setRepresentativePhoto(selectedImage);
            setPhotoUri(selectedImage.uri);
        }
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const pincodeRegex = /^[1-9][0-9]{5}$/;

        if (!businessName.trim()) {
            newErrors.businessName = 'Business name is required';
        }

        if (!businessType) {
            newErrors.businessType = 'Business type is required';
        }

        if (!dateOfEstablishment) {
            newErrors.dateOfEstablishment = 'Date of establishment is required';
        }

        if (!city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!pincode.trim() || !pincodeRegex.test(pincode)) {
            newErrors.pincode = 'Valid 6-digit pincode is required';
        }

        if (!representativeName.trim()) {
            newErrors.representativeName = 'Representative name is required';
        }

        if (!representativeEmail.trim() || !emailRegex.test(representativeEmail)) {
            newErrors.representativeEmail = 'Valid email is required';
        }

        if (!representativeMobile.trim() || !phoneRegex.test(representativeMobile)) {
            newErrors.representativeMobile = 'Valid 10-digit mobile is required';
        }

        if (!shortDescription.trim()) {
            newErrors.shortDescription = 'Short description is required';
        } else {
            const wordCount = shortDescription.trim().split(/\s+/).filter(Boolean).length;
            if (wordCount < 25 || wordCount > 150) {
                newErrors.shortDescription = `Short description must be 25-150 words (currently ${wordCount} words)`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!isEditing) return;
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            // Add text fields
            formData.append('businessName', businessName);
            formData.append('businessType', businessType);
            formData.append('dateOfEstablishment', dateOfEstablishment);
            formData.append('websiteUrl', websiteUrl);
            formData.append('shortDescription', shortDescription);

            // Add photo if selected
            if (representativePhoto) {
                formData.append('representativePhoto', {
                    uri: representativePhoto.uri,
                    type: representativePhoto.mimeType || 'image/jpeg',
                    name: representativePhoto.fileName || 'photo.jpg',
                });
            }

            const response = await api.patch('/api/updateprofprofile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Clear the newly selected photo since it's now uploaded
                setRepresentativePhoto(null);

                // Update form fields with response data (faster than refetching)
                const updatedProfile = response.data.data;
                if (updatedProfile) {
                    setBusinessName(updatedProfile.businessName || businessName);
                    setBusinessType(updatedProfile.businessType || businessType);
                    setDateOfEstablishment(updatedProfile.dateOfEstablishment ? new Date(updatedProfile.dateOfEstablishment).toISOString().split('T')[0] : dateOfEstablishment);
                    setWebsiteUrl(updatedProfile.websiteUrl || websiteUrl);
                    setCity(updatedProfile.city || city);
                    setState(updatedProfile.state || state);
                    setPincode(updatedProfile.pincode || pincode);
                    setAddressLine1(updatedProfile.registeredAddress?.line1 || addressLine1);
                    setRepresentativeName(updatedProfile.representativeName || representativeName);
                    setRepresentativeEmail(updatedProfile.representativeEmail || representativeEmail);
                    setRepresentativeMobile(updatedProfile.representativeMobile || representativeMobile);
                    setShortDescription(updatedProfile.shortDescription || shortDescription);

                    // Update photo URI from backend response
                    if (updatedProfile.representativePhoto) {
                        console.log('Updated photo URL from backend:', updatedProfile.representativePhoto);
                        // Ensure URL is complete (add base URL if it's a relative path)
                        let photoUrl = updatedProfile.representativePhoto.startsWith('http')
                            ? updatedProfile.representativePhoto
                            : `${process.env.EXPO_PUBLIC_API_BASE_URL}${updatedProfile.representativePhoto.replace(/^\//, '')}`;
                        // Add cache buster to force reload
                        photoUrl += (photoUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;
                        console.log('Setting photo URI to:', photoUrl);
                        setPhotoUri(photoUrl);
                    }
                }

                setIsEditing(false);
                showAlert({
                    title: 'Success',
                    message: 'Profile updated successfully!',
                    icon: '✅',
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => {
                                hideAlert();
                            },
                            style: 'primary'
                        }
                    ],
                });
            } else {
                showAlert({
                    title: 'Error',
                    message: response.data.message || 'Failed to update profile',
                    icon: '❌',
                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            showAlert({
                title: 'Error',
                message: error.response?.data?.message || error.message || 'Failed to update profile',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    if (fetching) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-500 mt-4">Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6">
                    <View className="flex-row justify-end mb-2">
                        {!isEditing && (
                            <TouchableOpacity onPress={() => setIsEditing(true)} className="flex-row items-center">
                                <Text className="text-primary-600 text-lg mr-1">✏️</Text>
                                <Text className="text-primary-600 font-semibold">Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View pointerEvents={isEditing ? 'auto' : 'none'} style={!isEditing ? { opacity: 0.96 } : undefined}>
                        {/* <Text className="text-2xl font-bold text-secondary-900 mb-6">
                        Update Profile
                    </Text> */}

                        {/* Profile Photo */}
                        <View className="mb-6 items-center">
                            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                                {photoUri ? (
                                    <Image
                                        key={photoUri}
                                        source={{ uri: photoUri }}
                                        style={{
                                            width: 128,
                                            height: 128,
                                            borderRadius: 64,
                                            backgroundColor: '#f1f5f9',
                                        }}
                                        resizeMode="cover"
                                        onError={(error) => {
                                            console.error('Image load error:', error);
                                            console.error('Failed to load image from:', photoUri);
                                            // Don't clear photoUri, just log the error
                                        }}
                                        onLoad={() => {
                                            console.log('Image loaded successfully from:', photoUri);
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 128,
                                            height: 128,
                                            borderRadius: 64,
                                            backgroundColor: '#e0f2fe',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text className="text-5xl">👤</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage} className="mt-3">
                                <Text className="text-primary-600 font-medium">
                                    {photoUri ? 'Change Photo' : 'Add Photo'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Business Information */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold text-secondary-900 mb-4">
                                Business Information
                            </Text>

                            <InputField
                                label="Business Name *"
                                value={businessName}
                                onChangeText={(text) => { setBusinessName(text); clearError('businessName'); }}
                                error={errors.businessName}
                                placeholder="Enter business name"
                                maxLength={140}
                            />

                            <DropdownSelector
                                label="Business Type *"
                                options={BUSINESS_TYPES}
                                selected={businessType}
                                onSelect={(val) => { setBusinessType(val); clearError('businessType'); }}
                                error={errors.businessType}
                            />

                            <DatePickerField
                                label="Date of Establishment *"
                                value={dateOfEstablishment}
                                onChange={(date) => { setDateOfEstablishment(date); clearError('dateOfEstablishment'); }}
                                error={errors.dateOfEstablishment}
                                placeholder="Select establishment date"
                                maximumDate={new Date()}
                                required
                            />

                            <InputField
                                label="Website URL"
                                value={websiteUrl}
                                onChangeText={setWebsiteUrl}
                                placeholder="https://www.example.com"
                                keyboardType="url"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Location */}
                        {/* <View className="mb-6">
                        <Text className="text-lg font-bold text-secondary-900 mb-4">
                            Location
                        </Text>

                        <InputField
                            label="Address Line 1"
                            value={addressLine1}
                            onChangeText={setAddressLine1}
                            placeholder="Building, Street"
                        />

                        <InputField
                            label="City *"
                            value={city}
                            onChangeText={(text) => { setCity(text); clearError('city'); }}
                            error={errors.city}
                            placeholder="Enter city"
                            editable={false}
                        />

                        <InputField
                            label="State *"
                            value={state}
                            onChangeText={(text) => { setState(text); clearError('state'); }}
                            error={errors.state}
                            placeholder="Enter state"
                            editable={false}
                        />

                        <InputField
                            label="Pincode *"
                            value={pincode}
                            onChangeText={(text) => { setPincode(text.replace(/[^0-9]/g, '').slice(0, 6)); clearError('pincode'); }}
                            error={errors.pincode}
                            placeholder="Enter 6-digit pincode"
                            keyboardType="number-pad"
                            maxLength={6}
                            editable={false}
                        />
                    </View> */}

                        {/* Representative Details */}
                        {/* <View className="mb-6">
                            <Text className="text-lg font-bold text-secondary-900 mb-4">
                                Representative Details
                            </Text>

                            <InputField
                                label="Representative Name *"
                                value={representativeName}
                                onChangeText={(text) => { setRepresentativeName(text); clearError('representativeName'); }}
                                error={errors.representativeName}
                                placeholder="Full name"
                                maxLength={120}
                                editable={false}
                            />

                            <InputField
                                label="Representative Email *"
                                value={representativeEmail}
                                onChangeText={(text) => { setRepresentativeEmail(text); clearError('representativeEmail'); }}
                                error={errors.representativeEmail}
                                placeholder="email@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={false}
                            />

                            <InputField
                                label="Representative Mobile *"
                                value={representativeMobile}
                                onChangeText={(text) => { setRepresentativeMobile(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('representativeMobile'); }}
                                error={errors.representativeMobile}
                                placeholder="10-digit mobile number"
                                keyboardType="phone-pad"
                                maxLength={10}
                                editable={false}
                            />
                        </View> */}

                        {/* About Business */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold text-secondary-900 mb-4">
                                About Business
                            </Text>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-secondary-800 mb-2">
                                    Short Description * <Text className="text-secondary-400 text-xs">(25-150 words)</Text>
                                </Text>
                                <InputField
                                    value={shortDescription}
                                    onChangeText={(text) => { setShortDescription(text); clearError('shortDescription'); }}
                                    error={errors.shortDescription}
                                    placeholder="Brief overview of your business (25-150 words)"
                                    multiline
                                    numberOfLines={4}
                                    maxLength={1000}
                                />
                            </View>
                        </View>

                    </View>

                    {isEditing && (
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <CustomButton
                                    title="Cancel"
                                    onPress={() => { setIsEditing(false); fetchProfile(); }}
                                    variant="outline"
                                    size="md"
                                />
                            </View>
                            <View className="flex-1">
                                <CustomButton
                                    title="Update Profile"
                                    onPress={handleSubmit}
                                    loading={loading}
                                    variant="primary"
                                    size="md"
                                />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
        </SafeAreaView>
    );
};

export default UpdateProfileScreen;

