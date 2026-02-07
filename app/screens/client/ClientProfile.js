import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';
import Router from '../../config/Router';
import {
    InputField,
    CustomButton,
    ErrorText,
    CustomAlert,
} from '../../components';

const ClientProfile = () => {
    const { user, updateUser } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null); // new upload
    const [photoPreview, setPhotoPreview] = useState('');

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const response = await api.get(Router.USER.GET_PROFILE);
            const data = Array.isArray(response.data?.data) ? response.data.data[0] : response.data?.data;
            if (data) {
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setEmail(data.email || '');
                setMobileNumber(data.mobileNumber || '');
                setAddress(data.address?.line1 || '');
                setCity(data.city || '');
                setState(data.state || '');
                setPincode(data.pincode || '');

                if (data.profilePhoto) {
                    const uri = data.profilePhoto.startsWith('http')
                        ? data.profilePhoto
                        : `${process.env.EXPO_PUBLIC_API_BASE_URL}${data.profilePhoto.replace(/^\//, '')}`;
                    setPhotoPreview(uri);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showAlert({
                title: 'Error',
                message: 'Unable to load profile. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setFetching(false);
        }
    };

    const pickImage = async () => {
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
            const selected = result.assets[0];
            setProfilePhoto(selected);
            setPhotoPreview(selected.uri);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!firstName.trim() || firstName.length < 3) {
            newErrors.firstName = 'First name must be at least 3 characters';
        }
        if (!lastName.trim() || lastName.length < 3) {
            newErrors.lastName = 'Last name must be at least 3 characters';
        }
        if (!email.trim() || !emailRegex.test(email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!mobileNumber.trim() || !phoneRegex.test(mobileNumber)) {
            newErrors.mobileNumber = 'Valid 10-digit mobile number is required';
        }
        if (pincode && (!/^[0-9]{6}$/.test(pincode))) {
            newErrors.pincode = 'Pincode must be 6 digits';
        }
        if (!address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('mobileNumber', mobileNumber);
            if (address) formData.append('address', address);
            if (city) formData.append('city', city);
            if (state) formData.append('state', state);
            if (pincode) formData.append('pincode', pincode);

            const formattedAddress = `${address}, ${city}, ${state} - ${pincode}`
                .replace(/,\s*,/g, ',')
                .replace(/^,\s*|,\s*$/g, '');
            if (formattedAddress.trim()) {
                formData.append('formattedAddress', formattedAddress);
            }

            if (profilePhoto?.uri) {
                formData.append('profilePhoto', {
                    uri: profilePhoto.uri,
                    type: profilePhoto.mimeType || 'image/jpeg',
                    name: profilePhoto.fileName || profilePhoto.name || 'profile.jpg',
                });
            }

            const response = await api.patch(Router.USER.UPDATE_PROFILE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                const updated = response.data.data;
                // Update cached user info (name & email)
                updateUser({
                    id: updated._id || user?.id,
                    email: updated.email || email,
                    name: `${updated.firstName || firstName} ${updated.lastName || lastName}`.trim(),
                    role: user?.role || 'user',
                    profilePhoto: updated.profilePhoto || profilePhoto?.uri || photoPreview,
                });

                showAlert({
                    title: 'Success',
                    message: 'Profile updated successfully.',
                    icon: '✅',
                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                });
            } else {
                showAlert({
                    title: 'Update Failed',
                    message: response.data.message || 'Something went wrong. Please try again.',
                    icon: '❌',
                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            showAlert({
                title: 'Update Failed',
                message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#0d9488" />
                <Text className="mt-3 text-secondary-500">Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
                <View className="px-4 py-6">
                    <View className="flex-row justify-end mb-2">
                        {!isEditing && (
                            <TouchableOpacity onPress={() => setIsEditing(true)} className="flex-row items-center">
                                <Text className="text-primary-600 text-lg mr-1">✏️</Text>
                                <Text className="text-primary-600 font-semibold">Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className="items-center mb-6 " >
                        <TouchableOpacity onPress={isEditing ? pickImage : undefined} activeOpacity={0.8} disabled={!isEditing}>
                            <View className="w-28 h-28 rounded-full bg-primary-100 items-center justify-center overflow-hidden border-2 border-primary-500">
                                {photoPreview ? (
                                    <Image source={{ uri: photoPreview }} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <Text className="text-4xl">👤</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                        {isEditing && (
                            <Text className="text-sm text-secondary-500 mt-2">Tap to change photo</Text>
                        )}
                        <Text className="text-2xl font-bold text-secondary-900 mt-3">
                            {`${firstName || ''} ${lastName || ''}`.trim() || 'Client Name'}
                        </Text>
                        <Text className="text-base text-secondary-600">
                            {email || user?.email || ''}
                        </Text>
                    </View>

                    <View className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
                        <Text className="text-lg font-semibold text-secondary-900 mb-4">Profile Details</Text>

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <InputField
                                    label="First Name"
                                    value={firstName}
                                    onChangeText={(text) => { setFirstName(text); clearError('firstName'); }}
                                    error={errors.firstName}
                                    editable={isEditing}
                                />
                            </View>
                            <View className="flex-1">
                                <InputField
                                    label="Last Name"
                                    value={lastName}
                                    onChangeText={(text) => { setLastName(text); clearError('lastName'); }}
                                    error={errors.lastName}
                                    editable={isEditing}
                                />
                            </View>
                        </View>

                        <InputField
                            label="Email"
                            value={email}
                            onChangeText={(text) => { setEmail(text); clearError('email'); }}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={isEditing}
                        />

                        <InputField
                            label="Mobile Number"
                            value={mobileNumber}
                            onChangeText={(text) => { setMobileNumber(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('mobileNumber'); }}
                            error={errors.mobileNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                            editable={isEditing}
                        />

                        <InputField
                            label="Address"
                            value={address}
                            onChangeText={(text) => { setAddress(text); clearError('address'); }}
                            error={errors.address}
                            multiline
                            editable={isEditing}
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <InputField
                                    label="City"
                                    value={city}
                                    onChangeText={setCity}
                                    editable={isEditing}
                                />
                            </View>
                            <View className="flex-1">
                                <InputField
                                    label="State"
                                    value={state}
                                    onChangeText={setState}
                                    editable={isEditing}
                                />
                            </View>
                        </View>

                        <InputField
                            label="Pincode"
                            value={pincode}
                            onChangeText={(text) => { setPincode(text.replace(/[^0-9]/g, '').slice(0, 6)); clearError('pincode'); }}
                            error={errors.pincode}
                            keyboardType="number-pad"
                            maxLength={6}
                            editable={isEditing}
                        />
                        <ErrorText error={errors.address} />

                        {isEditing && (
                            <View className="mt-4 flex-row gap-3">
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
                                        title="Save Details"
                                        onPress={handleSave}
                                        loading={loading}
                                        variant="primary"
                                        size="md"
                                    />
                                </View>
                            </View>
                        )}
                    </View>
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

export default ClientProfile;

