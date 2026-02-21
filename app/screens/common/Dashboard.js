import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';
import Router from '../../config/Router';
import Icon, { IconNames } from '../../components/Icon';
import FadeInView from '../../components/FadeInView';
import AnimatedCard from '../../components/AnimatedCard';
import theme from '../../config/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Helpers ────────────────────────────────────────────
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const getCategoryColor = (category) => ({
    'ArchitectureConsultant': '#3b82f6',
    'InteriorDesigner': '#8b5cf6',
    'StructuralConsultant': '#10b981',
    'MEPConsultant': '#f59e0b',
    'Contractor': '#ef4444',
}[category] || '#64748b');

const getCategoryLabel = (category) => ({
    'ArchitectureConsultant': 'A',
    'InteriorDesigner': 'I',
    'StructuralConsultant': 'S',
    'MEPConsultant': 'M',
    'Contractor': 'C',
}[category] || '?');

const UserAvatar = ({ user, size = 44 }) => {
    const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
    const photoUri = user?.profilePhoto
        ? (user.profilePhoto.startsWith('http')
            ? user.profilePhoto
            : `${process.env.EXPO_PUBLIC_API_BASE_URL}${user.profilePhoto.replace(/^\//, '')}`)
        : null;

    return (
        <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
            {photoUri ? (
                <Image
                    source={{ uri: photoUri }}
                    style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
                />
            ) : (
                <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
            )}
        </View>
    );
};

// ─── Stat card config ───────────────────────────────────
const CLIENT_STAT_CONFIG = [
    { key: 'My Requests', icon: 'documentText', bgColor: '#eff6ff', iconColor: '#3b82f6', textColor: '#1e40af' },
    { key: 'Active Projects', icon: 'checkmarkCircle', bgColor: '#ecfdf5', iconColor: '#10b981', textColor: '#065f46' },
    { key: 'Accepted', icon: 'thumbsUp', bgColor: '#f5f3ff', iconColor: '#8b5cf6', textColor: '#5b21b6' },
    { key: 'Pending', icon: 'time', bgColor: '#fff7ed', iconColor: '#f59e0b', textColor: '#92400e' },
];

const PRO_STAT_CONFIG = [
    { key: 'Total Leads', icon: 'people', bgColor: '#eff6ff', iconColor: '#3b82f6', textColor: '#1e40af' },
    { key: 'Accepted Leads', icon: 'checkmarkCircle', bgColor: '#ecfdf5', iconColor: '#10b981', textColor: '#065f46' },
    { key: 'Projects', icon: 'folder', bgColor: '#f5f3ff', iconColor: '#8b5cf6', textColor: '#5b21b6' },
    { key: 'Avg Rating', icon: 'star', bgColor: '#fff7ed', iconColor: '#f59e0b', textColor: '#92400e' },
];

// ═════════════════════════════════════════════════════════
// CLIENT DASHBOARD — Ola/Uber-style map + bottom sheet
// ═════════════════════════════════════════════════════════
const ClientDashboard = ({ dashboardData, error, navigation, user, insets }) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['28%', '55%', '88%'], []);
    const [userLocation, setUserLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [professionals, setProfessionals] = useState([]);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (userLocation) {
            fetchNearbyProfessionals();
        }
    }, [userLocation]);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            const { latitude, longitude } = location.coords;
            setUserLocation({ latitude, longitude });
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.06,
                longitudeDelta: 0.06,
            });
        } catch (e) {
            console.error('Location error:', e);
        }
    };

    const fetchNearbyProfessionals = async () => {
        if (!userLocation) return;
        try {
            const response = await api.get('/professional/nearby', {
                params: {
                    lat: userLocation.latitude,
                    lng: userLocation.longitude,
                    radius: 10,
                    limit: 30,
                },
            });
            if (response.data.success && response.data.data?.professionals) {
                setProfessionals(response.data.data.professionals);
            }
        } catch (e) {
            console.error('Error fetching nearby professionals:', e);
        }
    };

    const stats = dashboardData?.stats || [];
    const CARD_W = (SCREEN_WIDTH - 56) / 2;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* ── Full-screen Map ────────────────────── */}
                {region ? (
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        provider={PROVIDER_GOOGLE}
                        region={region}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        onMapReady={() => setMapReady(true)}
                    >
                        {/* Radius circle */}
                        {userLocation && (
                            <Circle
                                center={userLocation}
                                radius={10000}
                                strokeWidth={1.5}
                                strokeColor="rgba(13,148,136,0.35)"
                                fillColor="rgba(13,148,136,0.06)"
                            />
                        )}

                        {/* Professional markers */}
                        {professionals.map((prof) => {
                            if (!prof.location?.coordinates || prof.location.coordinates.length !== 2) return null;
                            const [lng, lat] = prof.location.coordinates;
                            return (
                                <Marker
                                    key={prof._id}
                                    coordinate={{ latitude: lat, longitude: lng }}
                                    title={prof.businessName}
                                    description={`${prof.distance?.toFixed(1) || 'N/A'} km away`}
                                    onCalloutPress={() => navigation.navigate('ProfessionalDetail', { professionalId: prof._id })}
                                >
                                    <View style={[styles.markerDot, { backgroundColor: getCategoryColor(prof.category) }]}>
                                        <Text style={styles.markerText}>{getCategoryLabel(prof.category)}</Text>
                                    </View>
                                </Marker>
                            );
                        })}
                    </MapView>
                ) : (
                    <View style={[StyleSheet.absoluteFillObject, styles.mapPlaceholder]}>
                        <ActivityIndicator size="large" color="#0d9488" />
                        <Text style={styles.mapPlaceholderText}>Loading map...</Text>
                    </View>
                )}

                {/* ── Floating Top Bar ───────────────────── */}
                <View style={[styles.floatingHeader, { top: insets.top + 4 }]}>
                    <View style={styles.floatingHeaderInner}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.greetingSmall}>{getGreeting()}</Text>
                            <Text style={styles.greetingName} numberOfLines={1}>
                                {user?.name || 'there'}
                            </Text>
                        </View>

                        {/* Notification bell */}
                        <TouchableOpacity
                            style={styles.notifButton}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Icon name={IconNames.notifications} size="lg" color="#0d9488" />
                        </TouchableOpacity>

                        {/* Avatar circle (Drawer trigger) */}
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            activeOpacity={0.8}
                            style={{ marginLeft: 12 }}
                        >
                            <UserAvatar user={user} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Bottom Sheet ────────────────────────── */}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    backgroundStyle={styles.sheetBackground}
                    handleIndicatorStyle={styles.sheetHandle}
                    enablePanDownToClose={false}
                >
                    <BottomSheetScrollView
                        contentContainerStyle={styles.sheetContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* ── CTA Buttons ──────────────── */}
                        <View style={styles.ctaRow}>
                            <TouchableOpacity
                                style={styles.ctaPrimary}
                                onPress={() => navigation.navigate('NearbyProfessionals')}
                                activeOpacity={0.85}
                            >
                                <View style={styles.ctaIconCircle}>
                                    <Icon name={IconNames.location} size="xl" color="#ffffff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.ctaTitle}>Find Professionals</Text>
                                    <Text style={styles.ctaSub}>Discover nearby experts</Text>
                                </View>
                                <Icon name={IconNames.chevronForward} size="md" color="rgba(255,255,255,0.6)" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ctaRow}>
                            <TouchableOpacity
                                style={styles.ctaSecondary}
                                onPress={() => navigation.navigate('CreateRequest')}
                                activeOpacity={0.85}
                            >
                                <View style={[styles.ctaIconCircle, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
                                    <Icon name={IconNames.add} size="xl" color="#10b981" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.ctaTitleDark}>Create New Request</Text>
                                    <Text style={styles.ctaSubDark}>Submit a project request</Text>
                                </View>
                                <Icon name={IconNames.chevronForward} size="md" color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* ── Error Banner ─────────────── */}
                        {error && (
                            <View style={styles.errorBanner}>
                                <Icon name={IconNames.alertCircle} size="md" color="#dc2626" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* ── Stat Cards ────────────────── */}
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <View style={styles.statsGrid}>
                            {stats.map((stat, index) => {
                                const config = CLIENT_STAT_CONFIG[index] || CLIENT_STAT_CONFIG[0];
                                return (
                                    <AnimatedCard
                                        key={index}
                                        style={[styles.statCard, { backgroundColor: config.bgColor, width: CARD_W }]}
                                    >
                                        <View style={[styles.statIconCircle, { backgroundColor: `${config.iconColor}20` }]}>
                                            <Icon name={IconNames[config.icon] || IconNames.analytics} size="lg" color={config.iconColor} />
                                        </View>
                                        <Text style={[styles.statValue, { color: config.textColor }]}>{stat.value}</Text>
                                        <Text style={styles.statLabel}>{stat.label}</Text>
                                    </AnimatedCard>
                                );
                            })}
                        </View>

                        {/* ── Nearby Summary ─────────────── */}
                        {professionals.length > 0 && (
                            <View style={styles.nearbySummary}>
                                <View style={styles.nearbySummaryHeader}>
                                    <Text style={styles.sectionTitle}>Nearby Professionals</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('NearbyProfessionals')}>
                                        <Text style={styles.seeAllText}>See All</Text>
                                    </TouchableOpacity>
                                </View>
                                {professionals.slice(0, 3).map((prof) => (
                                    <TouchableOpacity
                                        key={prof._id}
                                        style={styles.profRow}
                                        onPress={() => navigation.navigate('ProfessionalDetail', { professionalId: prof._id })}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.profDot, { backgroundColor: getCategoryColor(prof.category) }]}>
                                            <Text style={styles.profDotText}>{getCategoryLabel(prof.category)}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.profName} numberOfLines={1}>{prof.businessName}</Text>
                                            <Text style={styles.profDist}>{prof.distance?.toFixed(1) || 'N/A'} km away</Text>
                                        </View>
                                        <Icon name={IconNames.chevronForward} size="sm" color="#94a3b8" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* ── Recent Activity ───────────── */}
                        {/* <View style={styles.recentActivity}>
                            <Text style={styles.sectionTitle}>Quick Actions</Text>
                            <Text style={styles.recentSubtext}>View and manage your activities</Text>
                        </View> */}

                        <View style={{ height: 40 }} />
                    </BottomSheetScrollView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

// ═════════════════════════════════════════════════════════
// PROFESSIONAL DASHBOARD — Enhanced ScrollView (no map)
// ═════════════════════════════════════════════════════════
const ProfessionalDashboard = ({ dashboardData, error, navigation, user, insets }) => {
    const stats = dashboardData?.stats || [];
    const CARD_W = (SCREEN_WIDTH - 56) / 2;

    // Derive quick counts
    const leadsCount = stats.find(s => s.label === 'Total Leads')?.value || '0';
    const projectsCount = stats.find(s => s.label === 'Projects')?.value || '0';

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 24, paddingTop: 48 }}>
                    {/* ── Greeting ──────────────────── */}
                    <FadeInView delay={100}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.proGreetingSmall}>{getGreeting()}</Text>
                                <Text style={styles.proGreetingName}>{user?.name || 'Professional'}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.openDrawer()}
                                activeOpacity={0.8}
                            >
                                <UserAvatar user={user} size={50} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.accentBar} />
                    </FadeInView>

                    {/* ── Error ─────────────────────── */}
                    {error && (
                        <View style={styles.errorBanner}>
                            <Icon name={IconNames.alertCircle} size="md" color="#dc2626" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* ── Stats ─────────────────────── */}
                    <FadeInView delay={300}>
                        <View style={styles.statsGrid}>
                            {stats.map((stat, index) => {
                                const config = PRO_STAT_CONFIG[index] || PRO_STAT_CONFIG[0];
                                return (
                                    <AnimatedCard
                                        key={index}
                                        style={[styles.statCard, { backgroundColor: config.bgColor, width: CARD_W }]}
                                    >
                                        <View style={[styles.statIconCircle, { backgroundColor: `${config.iconColor}20` }]}>
                                            <Icon name={IconNames[config.icon] || IconNames.analytics} size="lg" color={config.iconColor} />
                                        </View>
                                        <Text style={[styles.statValue, { color: config.textColor }]}>{stat.value}</Text>
                                        <Text style={styles.statLabel}>{stat.label}</Text>
                                    </AnimatedCard>
                                );
                            })}
                        </View>
                    </FadeInView>

                    {/* ── Quick Jump ────────────────── */}
                    <FadeInView delay={500}>
                        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Recent Activity</Text>
                        <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>
                            Quickly jump to your latest leads and projects.
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={[styles.quickJumpCard, { backgroundColor: '#eff6ff' }]}
                                onPress={() => navigation.navigate('Leads')}
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#3b82f6', marginBottom: 4 }}>Leads</Text>
                                <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e3a5f' }}>{leadsCount}</Text>
                                <Text style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>View client requests</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.quickJumpCard, { backgroundColor: '#f5f3ff' }]}
                                onPress={() => navigation.navigate('Projects')}
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#8b5cf6', marginBottom: 4 }}>Projects</Text>
                                <Text style={{ fontSize: 24, fontWeight: '700', color: '#3b1f6e' }}>{projectsCount}</Text>
                                <Text style={{ fontSize: 11, color: '#8b5cf6', marginTop: 4 }}>View your work</Text>
                            </TouchableOpacity>
                        </View>
                    </FadeInView>
                </View>
            </ScrollView>
        </View>
    );
};

// ═════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═════════════════════════════════════════════════════════
const Dashboard = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const role = user?.role?.toLowerCase() || 'user';

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    // Refetch on screen focus
    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [role])
    );

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (role === 'professional') {
                const response = await api.get(Router.PROFESSIONAL.GET_DASHBOARD_INFO);
                if (response.data.success) {
                    const data = response.data.data;
                    setDashboardData({
                        stats: [
                            { label: 'Total Leads', value: data.totalLeads?.toString() || '0' },
                            { label: 'Accepted Leads', value: data.totalLeadsConversion?.toString() || '0' },
                            { label: 'Projects', value: data.totalProjectsCount?.toString() || '0' },
                            { label: 'Avg Rating', value: data.avgRating ? data.avgRating.toFixed(1) : '0.0' },
                        ],
                    });
                }
            } else {
                const response = await api.get(Router.USER.GET_DASHBOARD_DETAILS);
                if (response.data.success) {
                    const data = response.data.data;
                    setDashboardData({
                        stats: [
                            { label: 'My Requests', value: (data.TotalRequests || 0).toString() },
                            { label: 'Active Projects', value: (data.ActiveProjects || 0).toString() },
                            { label: 'Accepted', value: (data.acceptedRequestCount || 0).toString() },
                            { label: 'Pending', value: (data.pendingRequestCount || 0).toString() },
                        ],
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
            setDashboardData({
                stats: role === 'professional'
                    ? [
                        { label: 'Total Leads', value: '0' },
                        { label: 'Accepted Leads', value: '0' },
                        { label: 'Projects', value: '0' },
                        { label: 'Avg Rating', value: '0.0' },
                    ]
                    : [
                        { label: 'My Requests', value: '0' },
                        { label: 'Active Projects', value: '0' },
                        { label: 'Accepted', value: '0' },
                        { label: 'Pending', value: '0' },
                    ],
            });
        } finally {
            setLoading(false);
        }
    };

    // ── Loading state ───────────────────────
    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0d9488" />
                <Text style={{ color: '#64748b', marginTop: 16, fontSize: 14 }}>Loading dashboard...</Text>
            </View>
        );
    }

    // ── Render based on role ────────────────
    if (role === 'professional') {
        return (
            <ProfessionalDashboard
                dashboardData={dashboardData}
                error={error}
                navigation={navigation}
                user={user}
                insets={insets}
            />
        );
    }

    return (
        <ClientDashboard
            dashboardData={dashboardData}
            error={error}
            navigation={navigation}
            user={user}
            insets={insets}
        />
    );
};

// ═════════════════════════════════════════════════════════
// STYLES
// ═════════════════════════════════════════════════════════
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },

    // ── Map ──────────────────────────────────
    mapPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
    },
    mapPlaceholderText: {
        color: '#64748b',
        marginTop: 12,
        fontSize: 14,
    },
    markerDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#ffffff',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
            android: { elevation: 5 },
        }),
    },
    markerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },

    // ── Floating Header ─────────────────────
    floatingHeader: {
        position: 'absolute',
        left: 10,
        right: 10,
        zIndex: 100,
    },
    floatingHeaderInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 10,
        ...Platform.select({
            ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0d9488',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    avatarImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    greetingSmall: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    greetingName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
    },
    notifButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0fdfa',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Bottom Sheet ────────────────────────
    sheetBackground: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        ...Platform.select({
            ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16 },
            android: { elevation: 16 },
        }),
    },
    sheetHandle: {
        backgroundColor: '#cbd5e1',
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    sheetContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },

    // ── CTA Buttons ─────────────────────────
    ctaRow: {
        marginBottom: 10,
    },
    ctaPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0d9488',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    ctaSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    ctaIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    ctaTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },
    ctaSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    ctaTitleDark: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    ctaSubDark: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },

    // ── Section ─────────────────────────────
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
        marginTop: 16,
    },

    // ── Error ───────────────────────────────
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 13,
        marginLeft: 8,
        flex: 1,
    },

    // ── Stat Cards ──────────────────────────
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        minHeight: 150, // Fixed height consistency
        justifyContent: 'space-between',
    },
    statIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // ── Nearby Summary ──────────────────────
    nearbySummary: {
        marginTop: 4,
    },
    nearbySummaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAllText: {
        color: '#0d9488',
        fontSize: 13,
        fontWeight: '600',
    },
    profRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 14,
        marginBottom: 8,
    },
    profDot: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profDotText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    profName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    profDist: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },

    // ── Recent Activity ─────────────────────
    recentActivity: {
        marginTop: 8,
    },
    recentSubtext: {
        color: '#64748b',
        fontSize: 13,
    },

    // ── Professional Dashboard ───────────────
    proGreetingSmall: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    proGreetingName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        marginTop: 2,
    },
    accentBar: {
        width: 48,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#0d9488',
        marginTop: 8,
        marginBottom: 20,
    },
    quickJumpCard: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
    },
});

export default Dashboard;
