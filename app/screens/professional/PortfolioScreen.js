import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    StyleSheet,
    Platform,
    Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../config/axios';
import Router from '../../config/Router';
import { InputField, ErrorText, CustomAlert, Icon, IconNames, FadeInView, AnimatedCard } from '../../components';
import { SkeletonCard } from '../../components/SkeletonLoader';

const PortfolioScreen = () => {
    const insets = useSafeAreaInsets();
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [isAdding, setIsAdding] = useState(false);
    const [portfolioTitle, setPortfolioTitle] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [portfolioLocation, setPortfolioLocation] = useState('');
    const [portfolioDescription, setPortfolioDescription] = useState('');
    const [projectCompletionYear, setProjectCompletionYear] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '', buttons: [] });

    const showAlert = (config) => { setAlertConfig(config); setAlertVisible(true); };
    const hideAlert = () => setAlertVisible(false);

    useEffect(() => { fetchPortfolios(); }, []);
    useFocusEffect(useCallback(() => { fetchPortfolios(); }, []));

    const fetchPortfolios = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.PROFESSIONAL.FETCH_PORTFOLIOS);
            if (response.data.success) {
                const data = (response.data.data || []).sort((a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setPortfolios(data);
            } else {
                setPortfolios([]);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            showAlert({ title: 'Error', message: 'Failed to load portfolio items.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            setPortfolios([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => { setRefreshing(true); fetchPortfolios(); };

    const getPortfolioImageUrl = (portfolio) => {
        let url = portfolio?.portfolioImage || '';
        if (!url) return null;
        if (Platform.OS === 'android' && url.includes('localhost'))
            url = url.replace('localhost', '10.0.2.2');
        return url;
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert({ title: 'Permission Required', message: 'We need access to your photo library.', icon: 'camera', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]) {
            setSelectedImage(result.assets[0]);
            if (errors.portfolioImage) setErrors(prev => ({ ...prev, portfolioImage: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!portfolioTitle.trim()) newErrors.portfolioTitle = 'Title is required';
        if (!buildingType.trim()) newErrors.buildingType = 'Building type is required';
        if (!portfolioLocation.trim()) newErrors.portfolioLocation = 'Location is required';
        if (!portfolioDescription.trim()) newErrors.portfolioDescription = 'Description is required';
        if (!projectCompletionYear.trim()) newErrors.projectCompletionYear = 'Completion year is required';
        else if (!/^\d{4}$/.test(projectCompletionYear.trim())) newErrors.projectCompletionYear = 'Enter a valid 4-digit year';
        if (!selectedImage?.uri) newErrors.portfolioImage = 'Portfolio image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearForm = () => {
        setPortfolioTitle(''); setBuildingType(''); setPortfolioLocation('');
        setPortfolioDescription(''); setProjectCompletionYear('');
        setIsFeatured(false); setSelectedImage(null); setErrors({});
    };

    const handleCreatePortfolio = async () => {
        if (!validateForm()) return;
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('portfolioTitle', portfolioTitle.trim());
            formData.append('buildingType', buildingType.trim());
            formData.append('portfolioLocation', portfolioLocation.trim());
            formData.append('portfolioDescription', portfolioDescription.trim());
            formData.append('projectCompletionYear', projectCompletionYear.trim());
            formData.append('isFeatured', isFeatured ? 'true' : 'false');
            if (selectedImage?.uri) {
                formData.append('portfolioImage', {
                    uri: selectedImage.uri,
                    type: selectedImage.mimeType || 'image/jpeg',
                    name: selectedImage.fileName || 'portfolio.jpg',
                });
            }
            const response = await api.post(Router.PROFESSIONAL.CREATE_PORTFOLIO, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                showAlert({
                    title: 'Success', message: 'Portfolio item created successfully.', icon: 'checkmark-circle',
                    buttons: [{ text: 'OK', onPress: () => { hideAlert(); clearForm(); setIsAdding(false); fetchPortfolios(); }, style: 'primary' }],
                });
            } else {
                throw new Error(response.data.message || 'Failed to create portfolio');
            }
        } catch (error) {
            console.error('Error creating portfolio:', error);
            showAlert({ title: 'Error', message: error.response?.data?.message || 'Failed to create portfolio item.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top + 20 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 40, marginBottom: 16 }}>
                    <View style={{ width: 140, height: 28, borderRadius: 8, backgroundColor: '#e2e8f0' }} />
                    <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', marginTop: 8 }} />
                </View>
                {[1, 2].map(i => <View key={i} style={{ paddingHorizontal: 20, marginBottom: 14 }}><SkeletonCard /></View>)}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0d9488']} />}
            >
                {/* ── Header ────────────────────── */}
                <FadeInView delay={100}>
                    <View style={styles.pageHeader}>
                        <View>
                            <Text style={styles.pageTitle}>Portfolio</Text>
                            <View style={styles.accentBar} />
                        </View>
                        <TouchableOpacity
                            style={[styles.addButton, isAdding && styles.addButtonCancel]}
                            onPress={() => { if (isAdding) { clearForm(); } setIsAdding(prev => !prev); }}
                        >
                            <Icon name={isAdding ? IconNames.close : IconNames.add} size="sm" color={isAdding ? '#475569' : '#ffffff'} />
                            <Text style={[styles.addButtonText, isAdding && styles.addButtonCancelText]}>
                                {isAdding ? 'Cancel' : 'Add'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </FadeInView>

                <View style={{ paddingHorizontal: 20 }}>
                    {/* ── Create Form ──────────────── */}
                    {isAdding && (
                        <FadeInView delay={200}>
                            <View style={styles.formCard}>
                                <View style={styles.formCardHeader}>
                                    <View style={[styles.sectionIconCircle, { backgroundColor: '#f0fdfa' }]}>
                                        <Icon name={IconNames.add} size="sm" color="#0d9488" />
                                    </View>
                                    <Text style={styles.formCardTitle}>New Portfolio Item</Text>
                                </View>

                                <InputField label="Title" value={portfolioTitle} onChangeText={setPortfolioTitle}
                                    placeholder="e.g. 3BHK Apartment in Bangalore" error={errors.portfolioTitle} leftIcon="briefcase" />
                                <InputField label="Building Type" value={buildingType} onChangeText={setBuildingType}
                                    placeholder="e.g. Residential, Commercial" error={errors.buildingType} leftIcon="home" />
                                <InputField label="Location" value={portfolioLocation} onChangeText={setPortfolioLocation}
                                    placeholder="City, State" error={errors.portfolioLocation} leftIcon="location" />
                                <InputField label="Completion Year" value={projectCompletionYear} onChangeText={setProjectCompletionYear}
                                    placeholder="e.g. 2024" keyboardType="number-pad" error={errors.projectCompletionYear} leftIcon="calendar" />
                                <InputField label="Description" value={portfolioDescription} onChangeText={setPortfolioDescription}
                                    placeholder="Describe the project, highlights, and your role"
                                    multiline numberOfLines={4} error={errors.portfolioDescription} leftIcon="document" />

                                {/* Image Picker */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.fieldLabel}>Portfolio Image</Text>
                                    <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                                        {selectedImage?.uri ? (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} resizeMode="cover" />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.imagePickerTitle}>Change Image</Text>
                                                    <Text style={styles.imagePickerSubtext}>Tap to select a different image</Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={styles.imagePickerIconBg}>
                                                    <Icon name={IconNames.camera} size="md" color="#64748b" />
                                                </View>
                                                <View>
                                                    <Text style={styles.imagePickerTitle}>Upload Cover Image</Text>
                                                    <Text style={styles.imagePickerSubtext}>PNG, JPG up to 5MB</Text>
                                                </View>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <ErrorText error={errors.portfolioImage} />
                                </View>

                                {/* Featured Toggle */}
                                <View style={styles.toggleRow}>
                                    <Text style={styles.toggleLabel}>Mark as Featured</Text>
                                    <Switch
                                        value={isFeatured}
                                        onValueChange={setIsFeatured}
                                        thumbColor={isFeatured ? '#0f766e' : '#f9fafb'}
                                        trackColor={{ false: '#e5e7eb', true: '#99f6e4' }}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                                    <TouchableOpacity
                                        style={[styles.formBtn, styles.formBtnOutline]}
                                        onPress={() => { clearForm(); setIsAdding(false); }}
                                        disabled={submitting}
                                    >
                                        <Text style={styles.formBtnOutlineText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.formBtn, styles.formBtnPrimary, submitting && { opacity: 0.6 }]}
                                        onPress={handleCreatePortfolio}
                                        disabled={submitting}
                                    >
                                        <Text style={styles.formBtnPrimaryText}>
                                            {submitting ? 'Saving...' : 'Add to Portfolio'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </FadeInView>
                    )}

                    {/* ── Portfolio List ──────────── */}
                    {portfolios.length === 0 ? (
                        <FadeInView delay={300}>
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconCircle}>
                                    <Icon name={IconNames.image} size="xl" color="#94a3b8" />
                                </View>
                                <Text style={styles.emptyTitle}>No Portfolio Items</Text>
                                <Text style={styles.emptySubtext}>Showcase your best work by adding portfolio items.</Text>
                            </View>
                        </FadeInView>
                    ) : (
                        portfolios.map((item, index) => {
                            const imageUrl = getPortfolioImageUrl(item);
                            return (
                                <FadeInView key={item.id || item._id} delay={200 + index * 100}>
                                    <AnimatedCard style={styles.portfolioCard}>
                                        {/* Image */}
                                        <View>
                                            {imageUrl ? (
                                                <Image source={{ uri: imageUrl }} style={styles.portfolioImage} resizeMode="cover" />
                                            ) : (
                                                <View style={[styles.portfolioImage, styles.portfolioImagePlaceholder]}>
                                                    <Icon name={IconNames.image} size="xl" color="#94a3b8" />
                                                </View>
                                            )}
                                            {item.isFeatured && (
                                                <View style={styles.featuredBadge}>
                                                    <Icon name={IconNames.starFilled} size="xxs" color="white" />
                                                    <Text style={styles.featuredText}>Featured</Text>
                                                </View>
                                            )}
                                        </View>
                                        {/* Content */}
                                        <View style={styles.portfolioContent}>
                                            <Text style={styles.portfolioTitle} numberOfLines={1}>{item.portfolioTitle || 'Untitled'}</Text>
                                            <Text style={styles.portfolioBuildingType}>{item.buildingType}</Text>

                                            <View style={styles.portfolioMeta}>
                                                <Icon name={IconNames.location} size="xs" color="#64748b" />
                                                <Text style={styles.portfolioMetaText}>
                                                    {item.portfolioLocation} • {item.projectCompletionYear}
                                                </Text>
                                            </View>

                                            <Text style={styles.portfolioDesc} numberOfLines={3}>{item.portfolioDescription}</Text>
                                        </View>
                                    </AnimatedCard>
                                </FadeInView>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <CustomAlert visible={alertVisible} title={alertConfig.title} message={alertConfig.message}
                icon={alertConfig.icon} buttons={alertConfig.buttons} onClose={hideAlert} />
        </View>
    );
};

const styles = StyleSheet.create({
    // ── Page Header ─────────────────────
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        marginBottom: 20,
    },
    pageTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
    accentBar: { width: 48, height: 4, borderRadius: 2, backgroundColor: '#0d9488', marginTop: 8 },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0d9488',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        gap: 6,
        ...Platform.select({ ios: { shadowColor: '#0d9488', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6 }, android: { elevation: 4 } }),
    },
    addButtonCancel: { backgroundColor: '#f1f5f9' },
    addButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
    addButtonCancelText: { color: '#475569' },

    // ── Form Card ─────────────────────
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }),
    },
    formCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    sectionIconCircle: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    formCardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },

    fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
    imagePicker: {
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#cbd5e1',
        borderRadius: 14,
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    imagePreview: { width: 64, height: 64, borderRadius: 10, marginRight: 12 },
    imagePickerIconBg: { backgroundColor: '#e2e8f0', padding: 12, borderRadius: 16, marginRight: 14 },
    imagePickerTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
    imagePickerSubtext: { fontSize: 12, color: '#64748b', marginTop: 2 },

    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingVertical: 4 },
    toggleLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },

    formBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
    formBtnOutline: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
    formBtnPrimary: { backgroundColor: '#0d9488' },
    formBtnOutlineText: { color: '#475569', fontWeight: '700' },
    formBtnPrimaryText: { color: '#ffffff', fontWeight: '700' },

    // ── Portfolio Card ─────────────────
    portfolioCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }),
    },
    portfolioImage: { width: '100%', height: 220 },
    portfolioImagePlaceholder: { backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
    featuredBadge: {
        position: 'absolute', top: 12, left: 12,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    },
    featuredText: { fontSize: 10, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    portfolioContent: { padding: 18 },
    portfolioTitle: { fontSize: 19, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
    portfolioBuildingType: { fontSize: 12, fontWeight: '700', color: '#0d9488', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
    portfolioMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
    portfolioMetaText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
    portfolioDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },

    // ── Empty State ─────────────────────
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyIconCircle: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#64748b', textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});

export default PortfolioScreen;
