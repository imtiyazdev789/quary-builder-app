import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';
import Router from '../../config/Router';
import {
    InputField,
    CustomButton,
    ErrorText,
    CustomAlert,
} from '../../components';
import Icon, { IconNames } from '../../components/Icon';
import FadeInView from '../../components/FadeInView';
import { SkeletonProfile } from '../../components/SkeletonLoader';
import theme from '../../config/theme';

const ClientProfile = () => {
    const { user, updateUser } = useAuth();
    const insets = useSafeAreaInsets();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
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
                    icon: 'checkmark-circle',
                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                });
            } else {
                showAlert({
                    title: 'Update Failed',
                    message: response.data.message || 'Something went wrong. Please try again.',
                    icon: 'close-circle',
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

    // ── Skeleton Loading ─────────────────────
    if (fetching) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top }}>
                <SkeletonProfile />
            </View>
        );
    }

    const displayName = `${firstName || ''} ${lastName || ''}`.trim() || 'Client Name';
    const displayEmail = email || user?.email || '';
    const initials = `${(firstName || 'C').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Teal Header Area ──────────────── */}
                <View style={[styles.headerBg, { paddingTop: insets.top + 16 }]}>
                    {/* Edit button */}
                    <View style={styles.editRow}>
                        {!isEditing ? (
                            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                                <Icon name={IconNames.create} size="md" color="#ffffff" />
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 60 }} />
                        )}
                    </View>

                    {/* Avatar */}
                    <FadeInView delay={100} style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={isEditing ? pickImage : undefined}
                            activeOpacity={0.8}
                            disabled={!isEditing}
                        >
                            <View style={styles.avatarOuter}>
                                <View style={styles.avatarInner}>
                                    {photoPreview ? (
                                        <Image source={{ uri: photoPreview }} style={styles.avatarImage} />
                                    ) : (
                                        <Text style={styles.avatarInitials}>{initials}</Text>
                                    )}
                                </View>
                            </View>
                            {isEditing && (
                                <View style={styles.cameraIcon}>
                                    <Icon name={IconNames.camera} size="sm" color="#ffffff" />
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.headerName}>{displayName}</Text>
                        <Text style={styles.headerEmail}>{displayEmail}</Text>
                    </FadeInView>
                </View>

                {/* ── Form Sections ─────────────────── */}
                <View style={styles.formContainer}>
                    {/* Personal Info */}
                    <FadeInView delay={200}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#eff6ff' }]}>
                                    <Icon name={IconNames.person} size="md" color="#3b82f6" />
                                </View>
                                <Text style={styles.sectionTitle}>Personal Info</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        label="First Name"
                                        value={firstName}
                                        onChangeText={(text) => { setFirstName(text); clearError('firstName'); }}
                                        error={errors.firstName}
                                        editable={isEditing}
                                        leftIcon="person"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        label="Last Name"
                                        value={lastName}
                                        onChangeText={(text) => { setLastName(text); clearError('lastName'); }}
                                        error={errors.lastName}
                                        editable={isEditing}
                                        leftIcon="person"
                                    />
                                </View>
                            </View>
                        </View>
                    </FadeInView>

                    {/* Contact */}
                    <FadeInView delay={350}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#ecfdf5' }]}>
                                    <Icon name={IconNames.call} size="md" color="#10b981" />
                                </View>
                                <Text style={styles.sectionTitle}>Contact</Text>
                            </View>
                            <InputField
                                label="Email"
                                value={email}
                                onChangeText={(text) => { setEmail(text); clearError('email'); }}
                                error={errors.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={isEditing}
                                leftIcon="mail"
                            />
                            <InputField
                                label="Mobile Number"
                                value={mobileNumber}
                                onChangeText={(text) => { setMobileNumber(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('mobileNumber'); }}
                                error={errors.mobileNumber}
                                keyboardType="phone-pad"
                                maxLength={10}
                                editable={isEditing}
                                leftIcon="call"
                            />
                        </View>
                    </FadeInView>

                    {/* Address */}
                    <FadeInView delay={500}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#fff7ed' }]}>
                                    <Icon name={IconNames.location} size="md" color="#f59e0b" />
                                </View>
                                <Text style={styles.sectionTitle}>Address</Text>
                            </View>
                            <InputField
                                label="Address"
                                value={address}
                                onChangeText={(text) => { setAddress(text); clearError('address'); }}
                                error={errors.address}
                                multiline
                                editable={isEditing}
                                leftIcon="location"
                            />
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <InputField
                                        label="City"
                                        value={city}
                                        onChangeText={setCity}
                                        editable={isEditing}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
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
                        </View>
                    </FadeInView>

                    {/* ── Save / Cancel ─────────────── */}
                    {isEditing && (
                        <FadeInView delay={600}>
                            <View style={styles.actionRow}>
                                <View style={{ flex: 1 }}>
                                    <CustomButton
                                        title="Cancel"
                                        onPress={() => { setIsEditing(false); fetchProfile(); }}
                                        variant="outline"
                                        size="md"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <CustomButton
                                        title="Save Details"
                                        onPress={handleSave}
                                        loading={loading}
                                        variant="primary"
                                        size="md"
                                    />
                                </View>
                            </View>
                        </FadeInView>
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
        </View>
    );
};

const styles = StyleSheet.create({
    // ── Header ────────────────────────────
    headerBg: {
        backgroundColor: '#0d9488',
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    editRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },

    // ── Avatar ────────────────────────────
    avatarOuter: {
        width: 124,
        height: 124,
        borderRadius: 62,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
            android: { elevation: 6 },
        }),
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInitials: {
        fontSize: 36,
        fontWeight: '700',
        color: '#0d9488',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#0d9488',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },

    // ── Header Text ───────────────────────
    headerName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginTop: 12,
    },
    headerEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 4,
    },

    // ── Form ──────────────────────────────
    formContainer: {
        paddingHorizontal: 16,
        marginTop: -20,
    },
    sectionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 14,
        ...Platform.select({
            ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
            android: { elevation: 3 },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },

    // ── Actions ───────────────────────────
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
        marginBottom: 16,
    },
});

export default ClientProfile;
