import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, ErrorText } from '../../components';
import Icon, { IconNames } from '../../components/Icon';
import FadeInView from '../../components/FadeInView';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const CreateReviewScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { request, professionalId } = route.params || {};

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '', buttons: [] });

    const showAlert = (config) => { setAlertConfig(config); setAlertVisible(true); };
    const hideAlert = () => setAlertVisible(false);

    const handleStarPress = (starValue) => {
        setRating(starValue);
        setErrors(prev => ({ ...prev, rating: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!rating || rating < 1 || rating > 5)
            newErrors.rating = 'Please select a rating';
        if (comment.trim() && comment.trim().length < 10)
            newErrors.comment = 'Comment must be at least 10 characters';
        if (comment.trim().length > 400)
            newErrors.comment = 'Comment must not exceed 400 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (!professionalId || !request?.id) {
            showAlert({ title: 'Error', message: 'Missing required information. Please go back and try again.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: () => navigation.goBack(), style: 'primary' }] });
            return;
        }
        try {
            setLoading(true);
            const payload = { professionalId, rating, requestId: request.id };
            if (comment.trim()) payload.comment = comment.trim();
            const response = await api.post(Router.REVIEW.CREATE_REVIEW, payload);
            if (response.data.success) {
                showAlert({ title: 'Review Submitted!', message: 'Your review has been submitted successfully. Thank you for your feedback!', icon: 'checkmark-circle', buttons: [{ text: 'Done', onPress: () => { hideAlert(); navigation.goBack(); }, style: 'primary' }] });
            } else {
                throw new Error(response.data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            let errorMessage = 'Failed to submit review. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                if (errorMessage.includes('One Time') || errorMessage.includes('duplicate'))
                    errorMessage = 'You have already reviewed this professional for this request.';
            }
            showAlert({ title: 'Error', message: errorMessage, icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* ── Header ───────────────────── */}
                <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name={IconNames.arrowBack} size="md" color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Write a Review</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Professional Info ─────── */}
                    {request?.providerName && (
                        <FadeInView delay={100}>
                            <View style={styles.proCard}>
                                <View style={styles.proAvatar}>
                                    <Text style={styles.proAvatarText}>
                                        {request.providerName.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.reviewingLabel}>You're reviewing</Text>
                                    <Text style={styles.proName}>{request.providerName}</Text>
                                    {request.clientProjectCategory && (
                                        <Text style={styles.proCategory}>{request.clientProjectCategory}</Text>
                                    )}
                                </View>
                            </View>
                        </FadeInView>
                    )}

                    {/* ── Star Rating ───────────── */}
                    <FadeInView delay={200}>
                        <View style={styles.ratingCard}>
                            <Text style={styles.ratingPrompt}>How would you rate this professional?</Text>

                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => handleStarPress(star)}
                                        style={styles.starButton}
                                        activeOpacity={0.7}
                                    >
                                        <Icon
                                            name={star <= rating ? IconNames.starFilled : IconNames.star}
                                            size={36}
                                            color={star <= rating ? '#f59e0b' : '#d1d5db'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {rating > 0 && (
                                <View style={styles.ratingLabelRow}>
                                    <View style={styles.ratingLabelPill}>
                                        <Text style={styles.ratingLabelText}>
                                            {rating}/5 — {RATING_LABELS[rating]}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {errors.rating && <ErrorText error={errors.rating} />}
                        </View>
                    </FadeInView>

                    {/* ── Comment ───────────────── */}
                    <FadeInView delay={300}>
                        <View style={styles.commentCard}>
                            <View style={styles.commentHeader}>
                                <Icon name={IconNames.chatbubble} size="sm" color="#0d9488" />
                                <Text style={styles.commentTitle}>Your Review</Text>
                                <Text style={styles.commentOptional}>(Optional)</Text>
                            </View>
                            <Text style={styles.commentHint}>
                                Share your experience. Minimum 10 characters if provided.
                            </Text>
                            <TextInput
                                style={styles.commentInput}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                placeholder="Write your review here..."
                                placeholderTextColor="#94a3b8"
                                value={comment}
                                onChangeText={(text) => {
                                    setComment(text);
                                    setErrors(prev => ({ ...prev, comment: '' }));
                                }}
                                maxLength={400}
                            />
                            <View style={styles.commentFooter}>
                                <View style={{ flex: 1 }}>
                                    {errors.comment && <ErrorText error={errors.comment} />}
                                </View>
                                <Text style={[styles.charCount, comment.length > 380 && { color: '#ef4444' }]}>
                                    {comment.length}/400
                                </Text>
                            </View>
                        </View>
                    </FadeInView>

                    {/* ── Submit ────────────────── */}
                    <FadeInView delay={400}>
                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.6 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            <Icon name={loading ? IconNames.refresh : IconNames.checkmarkCircle} size="md" color="#ffffff" />
                            <Text style={styles.submitText}>
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.submitNote}>
                            Your review helps other clients make informed decisions.
                        </Text>
                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#0f172a' },

    // ── Professional Card ─────────────────
    proCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } }),
    },
    proAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#0d9488',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    proAvatarText: { color: '#ffffff', fontSize: 22, fontWeight: '700' },
    reviewingLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
    proName: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginTop: 2 },
    proCategory: { fontSize: 13, color: '#64748b', marginTop: 2 },

    // ── Rating Card ───────────────────────
    ratingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } }),
    },
    ratingPrompt: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 20, textAlign: 'center' },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
    starButton: { padding: 4 },
    ratingLabelRow: { alignItems: 'center' },
    ratingLabelPill: { backgroundColor: '#fef3c7', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    ratingLabelText: { fontSize: 14, fontWeight: '700', color: '#92400e' },

    // ── Comment Card ──────────────────────
    commentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } }),
    },
    commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    commentTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    commentOptional: { fontSize: 12, color: '#94a3b8', fontWeight: '400' },
    commentHint: { fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 18 },
    commentInput: {
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        color: '#0f172a',
        minHeight: 120,
        backgroundColor: '#f8fafc',
        lineHeight: 22,
    },
    commentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    charCount: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },

    // ── Submit ────────────────────────────
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#0d9488',
        borderRadius: 16,
        paddingVertical: 16,
        ...Platform.select({ ios: { shadowColor: '#0d9488', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 5 } }),
    },
    submitText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    submitNote: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 14, lineHeight: 18 },
});

export default CreateReviewScreen;
