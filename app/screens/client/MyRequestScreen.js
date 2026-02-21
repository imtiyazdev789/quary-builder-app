import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert } from '../../components';
import Icon, { IconNames } from '../../components/Icon';
import AnimatedCard from '../../components/AnimatedCard';
import FadeInView from '../../components/FadeInView';
import { SkeletonCard } from '../../components/SkeletonLoader';

const MyRequestScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.REQUEST.GET_CLIENT_REQUESTS);

            if (response.data.success) {
                const requestsData = response.data.data || [];
                const sortedRequests = requestsData.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });
                setRequests(sortedRequests);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load requests. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            setRequests([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchRequests();
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'accepted':
                return { label: 'Accepted', bg: '#ecfdf5', color: '#065f46', icon: IconNames.checkmarkCircle, iconColor: '#10b981' };
            case 'rejected':
                return { label: 'Rejected', bg: '#fef2f2', color: '#991b1b', icon: IconNames.closeCircle, iconColor: '#dc2626' };
            case 'new':
            default:
                return { label: 'New', bg: '#eff6ff', color: '#1e40af', icon: IconNames.time, iconColor: '#3b82f6' };
        }
    };

    const getCategoryLabel = (category) => ({
        'ArchitectureConsultant': 'Architecture',
        'InteriorDesigner': 'Interior Design',
        'StructuralConsultant': 'Structural Engineering',
        'MEPConsultant': 'MEP',
        'Contractor': 'Contractor',
    }[category] || category);

    // ── Skeleton Loading ──────────────────────
    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top + 20 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 40, marginBottom: 16 }}>
                    <View style={{ width: 140, height: 28, borderRadius: 8, backgroundColor: '#e2e8f0' }} />
                    <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', marginTop: 8 }} />
                </View>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={{ paddingHorizontal: 20, marginBottom: 14 }}>
                        <SkeletonCard />
                    </View>
                ))}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0d9488']}
                    />
                }
            >
                {/* ── Header ────────────────────── */}
                <FadeInView delay={100}>
                    <View style={{ paddingTop: 40, marginBottom: 20 }}>
                        <Text style={styles.pageTitle}>My Requests</Text>
                        <View style={styles.accentBar} />
                    </View>
                </FadeInView>

                {/* ── Empty ──────────────────────── */}
                {requests.length === 0 ? (
                    <FadeInView delay={200}>
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Icon name={IconNames.documentText} size="xl" color="#94a3b8" />
                            </View>
                            <Text style={styles.emptyTitle}>No Requests Yet</Text>
                            <Text style={styles.emptySubtext}>
                                Create your first project request to get started with nearby professionals.
                            </Text>
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate('CreateRequest')}
                                activeOpacity={0.85}
                            >
                                <Icon name={IconNames.add} size="md" color="#ffffff" />
                                <Text style={styles.emptyButtonText}>Create Request</Text>
                            </TouchableOpacity>
                        </View>
                    </FadeInView>
                ) : (
                    /* ── Request Cards ──────────────── */
                    requests.map((request, index) => {
                        const statusConfig = getStatusConfig(request.status);
                        return (
                            <FadeInView key={request.id || index} delay={150 + index * 80}>
                                <AnimatedCard>
                                    <TouchableOpacity
                                        style={styles.card}
                                        onPress={() => navigation.navigate('RequestDetails', { request })}
                                        activeOpacity={0.7}
                                    >
                                        {/* Top: Category + Status */}
                                        <View style={styles.cardHeader}>
                                            <View style={{ flex: 1, marginRight: 10 }}>
                                                <Text style={styles.cardCategory} numberOfLines={1}>
                                                    {getCategoryLabel(request.clientProjectCategory)}
                                                </Text>
                                                {request.clientProjectType && (
                                                    <Text style={styles.cardType} numberOfLines={1}>
                                                        {request.clientProjectType}
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                                                <Icon name={statusConfig.icon} size="xs" color={statusConfig.iconColor} />
                                                <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                                    {statusConfig.label}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Description */}
                                        {request.clientProjectDetail && (
                                            <Text style={styles.cardDesc} numberOfLines={2}>
                                                {request.clientProjectDetail}
                                            </Text>
                                        )}

                                        {/* Service tags */}
                                        {request.clientProjectServicesType?.length > 0 && (
                                            <View style={styles.tagsRow}>
                                                {request.clientProjectServicesType.slice(0, 3).map((service, i) => (
                                                    <View key={i} style={styles.tag}>
                                                        <Text style={styles.tagText}>{service}</Text>
                                                    </View>
                                                ))}
                                                {request.clientProjectServicesType.length > 3 && (
                                                    <View style={[styles.tag, { backgroundColor: '#f1f5f9' }]}>
                                                        <Text style={[styles.tagText, { color: '#64748b' }]}>
                                                            +{request.clientProjectServicesType.length - 3}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {/* Accepted quotation banner */}
                                        {request.status === 'accepted' && request.estimatedQuotation && (
                                            <View style={styles.quotationBanner}>
                                                <Icon name={IconNames.checkmarkCircle} size="sm" color="#10b981" />
                                                <Text style={styles.quotationText}>
                                                    Quotation: {request.estimatedQuotation}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Rejected reason banner */}
                                        {request.status === 'rejected' && request.rejectionReason && (
                                            <View style={[styles.quotationBanner, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                                                <Icon name={IconNames.closeCircle} size="sm" color="#dc2626" />
                                                <Text style={[styles.quotationText, { color: '#991b1b' }]}>
                                                    {request.rejectionReason}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Footer metadata */}
                                        <View style={styles.metaFooter}>
                                            {request.clientProjectBudgetRange && (
                                                <View style={styles.metaItem}>
                                                    <Icon name={IconNames.wallet} size="xs" color="#64748b" />
                                                    <Text style={styles.metaText}>{request.clientProjectBudgetRange}</Text>
                                                </View>
                                            )}
                                            {request.clientProjectTimeLine && (
                                                <View style={styles.metaItem}>
                                                    <Icon name={IconNames.time} size="xs" color="#64748b" />
                                                    <Text style={styles.metaText}>{request.clientProjectTimeLine}</Text>
                                                </View>
                                            )}
                                            <View style={styles.metaItem}>
                                                <Icon name={IconNames.calendar} size="xs" color="#64748b" />
                                                <Text style={styles.metaText}>{formatDate(request.createdAt)}</Text>
                                            </View>
                                        </View>

                                        {/* Provider */}
                                        {request.providerName && (
                                            <View style={styles.providerRow}>
                                                <View style={styles.providerDot} />
                                                <Text style={styles.providerText}>
                                                    Professional: <Text style={{ fontWeight: '600', color: '#0f172a' }}>{request.providerName}</Text>
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </AnimatedCard>
                            </FadeInView>
                        );
                    })
                )}
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
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
    },
    accentBar: {
        width: 48,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#0d9488',
        marginTop: 8,
    },

    // ── Card ────────────────────────────
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 14,
        ...Platform.select({
            ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
            android: { elevation: 3 },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    cardCategory: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
    },
    cardType: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardDesc: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
        marginBottom: 10,
    },

    // ── Tags ────────────────────────────
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#f0fdfa',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0d9488',
    },

    // ── Quotation banner ────────────────
    quotationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#a7f3d0',
        gap: 8,
    },
    quotationText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#065f46',
        flex: 1,
    },

    // ── Meta footer ─────────────────────
    metaFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },

    // ── Provider ────────────────────────
    providerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    providerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0d9488',
        marginRight: 8,
    },
    providerText: {
        fontSize: 12,
        color: '#64748b',
    },

    // ── Empty State ─────────────────────
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 20,
        marginBottom: 20,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0d9488',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
    },
    emptyButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default MyRequestScreen;
