import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
    InputField,
    DropdownSelector,
    DatePickerField,
    CustomButton,
    CustomAlert,
    Icon,
    IconNames,
} from '../../components';
import FadeInView from '../../components/FadeInView';
import { SkeletonProfile } from '../../components/SkeletonLoader';
import { BUSINESS_TYPES } from '../auth/professional-signup/constants';
import api from '../../config/axios';
import Router from '../../config/Router';
import { useAuth } from '../../context/AuthContext';

const UpdateProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [errors, setErrors] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '', buttons: [] });

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

    useEffect(() => { fetchProfile(); }, []);

    const showAlert = (config) => { setAlertConfig(config); setAlertVisible(true); };
    const hideAlert = () => setAlertVisible(false);
    const clearError = (field) => { if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' })); };

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const response = await api.get(Router.PROFESSIONAL.GET_MY_PROFILE);
            if (response.data.success && response.data.data) {
                const p = response.data.data;
                setBusinessName(p.businessName || '');
                setBusinessType(p.businessType || '');
                setDateOfEstablishment(p.dateOfEstablishment ? new Date(p.dateOfEstablishment).toISOString().split('T')[0] : '');
                setWebsiteUrl(p.websiteUrl || '');
                setCity(p.city || '');
                setState(p.state || '');
                setPincode(p.pincode || '');
                setAddressLine1(p.registeredAddress?.line1 || '');
                setRepresentativeName(p.representativeName || '');
                setRepresentativeEmail(p.representativeEmail || '');
                setRepresentativeMobile(p.representativeMobile || '');
                setShortDescription(p.shortDescription || '');
                if (p.representativePhoto) {
                    const base = process.env.EXPO_PUBLIC_API_BASE_URL || '';
                    const normalizedBase = base.includes('localhost') && Platform.OS === 'android'
                        ? base.replace('localhost', '10.0.2.2') : base;
                    let url = p.representativePhoto.startsWith('http')
                        ? p.representativePhoto
                        : `${normalizedBase}${p.representativePhoto.replace(/^\//, '')}`;
                    url += (url.includes('?') ? '&' : '?') + `t=${Date.now()}`;
                    setPhotoUri(url);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showAlert({ title: 'Error', message: 'Failed to load profile. Please try again.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
        } finally {
            setFetching(false);
        }
    };

    const pickImage = async () => {
        if (!isEditing) return;
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert({ title: 'Permission Denied', message: 'Please allow access to your photo library.', icon: 'camera', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]) {
            setRepresentativePhoto(result.assets[0]);
            setPhotoUri(result.assets[0].uri);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!businessType) newErrors.businessType = 'Business type is required';
        if (!dateOfEstablishment) newErrors.dateOfEstablishment = 'Date of establishment is required';
        if (!shortDescription.trim()) {
            newErrors.shortDescription = 'Short description is required';
        } else {
            const wordCount = shortDescription.trim().split(/\s+/).filter(Boolean).length;
            if (wordCount < 25 || wordCount > 150)
                newErrors.shortDescription = `Must be 25–150 words (currently ${wordCount})`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!isEditing || !validateForm()) return;
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('businessName', businessName);
            formData.append('businessType', businessType);
            formData.append('dateOfEstablishment', dateOfEstablishment);
            formData.append('websiteUrl', websiteUrl);
            formData.append('shortDescription', shortDescription);
            if (representativePhoto) {
                formData.append('representativePhoto', {
                    uri: representativePhoto.uri,
                    type: representativePhoto.mimeType || 'image/jpeg',
                    name: representativePhoto.fileName || 'photo.jpg',
                });
            }
            const response = await api.patch(Router.PROFESSIONAL.UPDATE_PROFILE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                setRepresentativePhoto(null);
                const updatedProfile = response.data.data;
                if (updatedProfile) {
                    setBusinessName(updatedProfile.businessName || businessName);
                    setBusinessType(updatedProfile.businessType || businessType);
                    setDateOfEstablishment(updatedProfile.dateOfEstablishment
                        ? new Date(updatedProfile.dateOfEstablishment).toISOString().split('T')[0]
                        : dateOfEstablishment);
                    setWebsiteUrl(updatedProfile.websiteUrl || websiteUrl);
                    setShortDescription(updatedProfile.shortDescription || shortDescription);
                    if (updatedProfile.representativePhoto) {
                        let photoUrl = updatedProfile.representativePhoto.startsWith('http')
                            ? updatedProfile.representativePhoto
                            : `${process.env.EXPO_PUBLIC_API_BASE_URL}${updatedProfile.representativePhoto.replace(/^\//, '')}`;
                        photoUrl += (photoUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;
                        setPhotoUri(photoUrl);
                    }
                }
                setIsEditing(false);
                showAlert({ title: 'Success', message: 'Profile updated successfully!', icon: 'checkmark-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            } else {
                showAlert({ title: 'Error', message: response.data.message || 'Failed to update profile', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            showAlert({ title: 'Error', message: error.response?.data?.message || error.message || 'Failed to update profile', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
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

    const displayName = businessName || representativeName || 'Professional';
    const businessTypeLabel = businessType || '';
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Teal Header ──────────────────── */}
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
                                    {photoUri ? (
                                        <Image source={{ uri: photoUri }} style={styles.avatarImage} />
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
                        <Text style={styles.headerEmail}>{businessTypeLabel}</Text>
                    </FadeInView>
                </View>

                {/* ── Form ──────────────────────────── */}
                <View style={styles.formContainer}>

                    {/* Business Information */}
                    <FadeInView delay={200}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#eff6ff' }]}>
                                    <Icon name={IconNames.briefcase} size="md" color="#3b82f6" />
                                </View>
                                <Text style={styles.sectionTitle}>Business Information</Text>
                            </View>

                            <InputField
                                label="Business Name *"
                                value={businessName}
                                onChangeText={(text) => { setBusinessName(text); clearError('businessName'); }}
                                error={errors.businessName}
                                placeholder="Enter business name"
                                maxLength={140}
                                leftIcon="briefcase"
                                editable={isEditing}
                            />

                            <DropdownSelector
                                label="Business Type *"
                                options={BUSINESS_TYPES}
                                selected={businessType}
                                onSelect={(val) => { setBusinessType(val); clearError('businessType'); }}
                                error={errors.businessType}
                                disabled={!isEditing}
                            />

                            <DatePickerField
                                label="Date of Establishment *"
                                value={dateOfEstablishment}
                                onChange={(date) => { setDateOfEstablishment(date); clearError('dateOfEstablishment'); }}
                                error={errors.dateOfEstablishment}
                                placeholder="Select establishment date"
                                maximumDate={new Date()}
                                required
                                disabled={!isEditing}
                            />

                            <InputField
                                label="Website URL"
                                value={websiteUrl}
                                onChangeText={setWebsiteUrl}
                                placeholder="https://www.example.com"
                                keyboardType="url"
                                autoCapitalize="none"
                                leftIcon="globe"
                                editable={isEditing}
                            />
                        </View>
                    </FadeInView>

                    {/* Representative Info (view-only) */}
                    <FadeInView delay={350}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#ecfdf5' }]}>
                                    <Icon name={IconNames.person} size="md" color="#10b981" />
                                </View>
                                <Text style={styles.sectionTitle}>Representative</Text>
                            </View>

                            <InputField
                                label="Name"
                                value={representativeName}
                                onChangeText={setRepresentativeName}
                                leftIcon="person"
                                editable={false}
                            />
                            <InputField
                                label="Email"
                                value={representativeEmail}
                                onChangeText={setRepresentativeEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                leftIcon="mail"
                                editable={false}
                            />
                            <InputField
                                label="Mobile"
                                value={representativeMobile}
                                onChangeText={setRepresentativeMobile}
                                keyboardType="phone-pad"
                                maxLength={10}
                                leftIcon="call"
                                editable={false}
                            />
                        </View>
                    </FadeInView>

                    {/* Location (view-only) */}
                    <FadeInView delay={450}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#fff7ed' }]}>
                                    <Icon name={IconNames.location} size="md" color="#f59e0b" />
                                </View>
                                <Text style={styles.sectionTitle}>Location</Text>
                            </View>
                            <InputField label="Address" value={addressLine1} onChangeText={setAddressLine1} leftIcon="location" editable={false} />
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <InputField label="City" value={city} onChangeText={setCity} editable={false} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <InputField label="State" value={state} onChangeText={setState} editable={false} />
                                </View>
                            </View>
                            <InputField label="Pincode" value={pincode} onChangeText={setPincode} keyboardType="number-pad" maxLength={6} editable={false} />
                        </View>
                    </FadeInView>

                    {/* About Business */}
                    <FadeInView delay={550}>
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconCircle, { backgroundColor: '#f3f4f6' }]}>
                                    <Icon name={IconNames.information} size="md" color="#6366f1" />
                                </View>
                                <Text style={styles.sectionTitle}>About Business</Text>
                            </View>
                            <InputField
                                label={`Short Description * (25–150 words)`}
                                value={shortDescription}
                                onChangeText={(text) => { setShortDescription(text); clearError('shortDescription'); }}
                                error={errors.shortDescription}
                                placeholder="Brief overview of your business (25-150 words)"
                                multiline
                                numberOfLines={4}
                                maxLength={1000}
                                editable={isEditing}
                            />
                        </View>
                    </FadeInView>

                    {/* Save / Cancel */}
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
                                        title="Save Changes"
                                        onPress={handleSubmit}
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
    avatarImage: { width: '100%', height: '100%' },
    avatarInitials: { fontSize: 36, fontWeight: '700', color: '#0d9488' },
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
    headerName: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginTop: 12 },
    headerEmail: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4, marginBottom: 4 },

    // ── Form ──────────────────────────────
    formContainer: { paddingHorizontal: 16, marginTop: -20 },
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
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sectionIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },

    // ── Actions ───────────────────────────
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 16 },
});

export default UpdateProfileScreen;
