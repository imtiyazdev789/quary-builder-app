import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StyleSheet,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, Icon, IconNames, FadeInView } from '../../components';
import { SkeletonCard } from '../../components/SkeletonLoader';

const StarRating = ({ rating }) => {
    const num = parseFloat(rating) || 0;
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Icon
                    key={i}
                    name={i <= num ? IconNames.starFilled : IconNames.star}
                    size="xs"
                    color={i <= num ? '#f59e0b' : '#d1d5db'}
                />
            ))}
        </View>
    );
};

const ReviewsScreen = () => {
    const insets = useSafeAreaInsets();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '', buttons: [] });

    useEffect(() => { fetchReviews(); }, []);
    useFocusEffect(useCallback(() => { fetchReviews(); }, []));

    const showAlert = (config) => { setAlertConfig(config); setAlertVisible(true); };
    const hideAlert = () => setAlertVisible(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.REVIEW.GET_PROFESSIONAL_REVIEWS);
            if (response.data.success) {
                const data = (response.data.data || []).sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt));
                setReviews(data);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showAlert({ title: 'Error', message: 'Failed to load reviews. Please try again.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            setReviews([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => { setRefreshing(true); fetchReviews(); };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const calculateAverageRating = () => {
        if (!reviews.length) return 0;
        return (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1);
    };

    const getClientName = (review) => {
        const c = review.clientId;
        if (!c) return 'Anonymous';
        const name = `${c.firstName || ''} ${c.lastName || ''}`.trim();
        return name || c.email || 'Anonymous';
    };

    const getClientInitials = (review) => {
        const name = getClientName(review);
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.charAt(0).toUpperCase();
    };

    const getProjectInfo = (review) => {
        const r = review.requestId;
        if (!r) return null;
        const type = r.clientProjectType || '';
        const category = r.clientProjectCategory || '';
        return [type, category].filter(Boolean).join(' • ') || null;
    };

    const getRatingDistribution = () => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            const star = Math.round(r.rating || 0);
            if (star >= 1 && star <= 5) dist[star]++;
        });
        return dist;
    };

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top + 20 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 40, marginBottom: 16 }}>
                    <View style={{ width: 120, height: 28, borderRadius: 8, backgroundColor: '#e2e8f0' }} />
                    <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', marginTop: 8 }} />
                </View>
                {[1, 2, 3].map(i => <View key={i} style={{ paddingHorizontal: 20, marginBottom: 14 }}><SkeletonCard /></View>)}
            </View>
        );
    }

    const averageRating = calculateAverageRating();
    const dist = getRatingDistribution();
    const maxDistCount = Math.max(1, ...Object.values(dist));

    const avatarColors = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0d9488']} />}
            >
                {/* ── Header ─────────────────────── */}
                <FadeInView delay={100}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 16, marginBottom: 20 }}>
                        <Text style={styles.pageTitle}>Reviews</Text>
                        <View style={styles.accentBar} />
                    </View>
                </FadeInView>

                <View style={{ paddingHorizontal: 20 }}>
                    {/* ── Rating Summary Card ──────── */}
                    {reviews.length > 0 && (
                        <FadeInView delay={150}>
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryLeft}>
                                    <Text style={styles.avgRatingNumber}>{averageRating}</Text>
                                    <StarRating rating={parseFloat(averageRating)} />
                                    <Text style={styles.reviewCount}>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</Text>
                                </View>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryRight}>
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <View key={star} style={styles.distRow}>
                                            <Text style={styles.distStar}>{star}</Text>
                                            <Icon name={IconNames.starFilled} size="xxs" color="#f59e0b" />
                                            <View style={styles.distBarBg}>
                                                <View style={[styles.distBarFill, {
                                                    width: `${(dist[star] / maxDistCount) * 100}%`,
                                                    minWidth: dist[star] > 0 ? 4 : 0,
                                                }]} />
                                            </View>
                                            <Text style={styles.distCount}>{dist[star]}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </FadeInView>
                    )}

                    {/* ── Reviews List ────────────── */}
                    {reviews.length === 0 ? (
                        <FadeInView delay={300}>
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconCircle}>
                                    <Icon name={IconNames.starFilled} size="xl" color="#f59e0b" />
                                </View>
                                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Keep providing great service to receive reviews from clients!
                                </Text>
                            </View>
                        </FadeInView>
                    ) : (
                        reviews.map((review, index) => {
                            const clientName = getClientName(review);
                            const projectInfo = getProjectInfo(review);
                            const initials = getClientInitials(review);
                            const avatarColor = avatarColors[index % avatarColors.length];

                            return (
                                <FadeInView key={review._id || review.id} delay={200 + index * 80}>
                                    <View style={styles.reviewCard}>
                                        {/* Card Header */}
                                        <View style={styles.reviewHeader}>
                                            {/* Avatar */}
                                            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                                                <Text style={styles.avatarText}>{initials}</Text>
                                            </View>
                                            {/* Name + Date */}
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.clientName}>{clientName}</Text>
                                                {projectInfo && (
                                                    <Text style={styles.projectInfo} numberOfLines={1}>{projectInfo}</Text>
                                                )}
                                            </View>
                                            {/* Date */}
                                            <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                                        </View>

                                        {/* Stars */}
                                        <View style={styles.starsRow}>
                                            <StarRating rating={review.rating} />
                                            <View style={[styles.ratingPill, {
                                                backgroundColor: review.rating >= 4 ? '#ecfdf5' : review.rating >= 3 ? '#fef3c7' : '#fef2f2',
                                            }]}>
                                                <Text style={[styles.ratingPillText, {
                                                    color: review.rating >= 4 ? '#065f46' : review.rating >= 3 ? '#92400e' : '#991b1b',
                                                }]}>
                                                    {Number(review.rating).toFixed(1)}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Comment */}
                                        {review.comment && (
                                            <Text style={styles.comment}>{review.comment}</Text>
                                        )}
                                    </View>
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
    pageTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
    accentBar: { width: 48, height: 4, borderRadius: 2, backgroundColor: '#0d9488', marginTop: 8 },

    // ── Summary Card ────────────────────
    summaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }),
    },
    summaryLeft: { alignItems: 'center', paddingRight: 20 },
    avgRatingNumber: { fontSize: 52, fontWeight: '800', color: '#0f172a', lineHeight: 60 },
    reviewCount: { fontSize: 12, color: '#64748b', marginTop: 6, fontWeight: '500' },
    summaryDivider: { width: 1, height: 80, backgroundColor: '#e2e8f0', marginRight: 20 },
    summaryRight: { flex: 1, gap: 4 },
    distRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    distStar: { fontSize: 11, color: '#64748b', fontWeight: '600', width: 10 },
    distBarBg: { flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
    distBarFill: { height: 6, backgroundColor: '#f59e0b', borderRadius: 3 },
    distCount: { fontSize: 11, color: '#94a3b8', width: 16, textAlign: 'right' },

    // ── Review Card ─────────────────────
    reviewCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 }, android: { elevation: 2 } }),
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    clientName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    projectInfo: { fontSize: 12, color: '#64748b', marginTop: 2 },
    reviewDate: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
    starsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    ratingPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    ratingPillText: { fontSize: 12, fontWeight: '700' },
    comment: { fontSize: 14, color: '#475569', lineHeight: 22 },

    // ── Empty State ─────────────────────
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyIconCircle: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#64748b', textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});

export default ReviewsScreen;
