import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Platform, Image, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { CustomAlert } from '../../components';
import Icon, { IconNames } from '../../components/Icon';
import FadeInView from '../../components/FadeInView';

const ProfessionalSetting = ({ navigation }) => {
    const { logout, user } = useAuth();
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = React.useState(true);
    const [emailUpdates, setEmailUpdates] = React.useState(true);
    const [logoutAlertVisible, setLogoutAlertVisible] = React.useState(false);

    const handleLogout = () => {
        setLogoutAlertVisible(true);
    };

    const confirmLogout = () => {
        setLogoutAlertVisible(false);
        logout();
    };

    const initials = (user?.name || 'P').charAt(0).toUpperCase();

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ───────────────────────── */}
                <FadeInView delay={100}>
                    <View style={{ paddingHorizontal: 4, paddingTop: 40, marginBottom: 24 }}>
                        <Text style={styles.pageTitle}>Settings</Text>
                        <View style={styles.accentBar} />
                    </View>
                </FadeInView>

                {/* ── Profile Card ─────────────────── */}
                <FadeInView delay={200}>
                    <TouchableOpacity
                        style={styles.profileCard}
                        onPress={() => navigation.navigate('UpdateProfile')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.profileAvatar}>
                            <Text style={styles.profileInitials}>{initials}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={styles.profileName} numberOfLines={1}>{user?.name || 'Professional'}</Text>
                            <Text style={styles.profileEmail} numberOfLines={1}>{user?.email || ''}</Text>
                            <View style={styles.profileBadge}>
                                <Text style={styles.profileBadgeText}>Professional</Text>
                            </View>
                        </View>
                        <Icon name={IconNames.chevronForward} size="md" color="#94a3b8" />
                    </TouchableOpacity>
                </FadeInView>

                {/* ── Notifications Group ──────────── */}
                <FadeInView delay={300}>
                    <View style={styles.card}>
                        <Text style={styles.groupLabel}>Notifications</Text>

                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                                <Icon name={IconNames.notifications} size="md" color="#3b82f6" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>Push Notifications</Text>
                                <Text style={styles.rowSub}>Receive alerts about new leads</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#e2e8f0', true: '#99f6e4' }}
                                thumbColor={notifications ? '#0d9488' : '#94a3b8'}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: '#f5f3ff' }]}>
                                <Icon name={IconNames.mail} size="md" color="#8b5cf6" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>Email Updates</Text>
                                <Text style={styles.rowSub}>Get lead summaries via email</Text>
                            </View>
                            <Switch
                                value={emailUpdates}
                                onValueChange={setEmailUpdates}
                                trackColor={{ false: '#e2e8f0', true: '#99f6e4' }}
                                thumbColor={emailUpdates ? '#0d9488' : '#94a3b8'}
                            />
                        </View>
                    </View>
                </FadeInView>

                {/* ── Account Group ────────────────── */}
                <FadeInView delay={400}>
                    <View style={styles.card}>
                        <Text style={styles.groupLabel}>Account</Text>

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => navigation.navigate('UpdateProfile')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#ecfdf5' }]}>
                                <Icon name={IconNames.person} size="md" color="#10b981" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>Edit Profile</Text>
                                <Text style={styles.rowSub}>Update your business details</Text>
                            </View>
                            <Icon name={IconNames.chevronForward} size="sm" color="#94a3b8" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => Linking.openURL('https://example.com/privacy')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#fff7ed' }]}>
                                <Icon name={IconNames.shield} size="md" color="#f59e0b" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>Privacy Policy</Text>
                                <Text style={styles.rowSub}>View our privacy policy</Text>
                            </View>
                            <Icon name={IconNames.chevronForward} size="sm" color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </FadeInView>

                {/* ── Logout ──────────────────────── */}
                <FadeInView delay={500}>
                    <TouchableOpacity
                        style={styles.logoutCard}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#fef2f2' }]}>
                            <Icon name={IconNames.logOut} size="md" color="#dc2626" />
                        </View>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </FadeInView>
            </ScrollView>

            <CustomAlert
                visible={logoutAlertVisible}
                title="Logout"
                message="Are you sure you want to logout?"
                icon="log-out"
                buttons={[
                    { text: 'Cancel', onPress: () => setLogoutAlertVisible(false), style: 'secondary' },
                    { text: 'Logout', onPress: confirmLogout, style: 'danger' },
                ]}
                onClose={() => setLogoutAlertVisible(false)}
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

    // ── Profile Card ────────────────────
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
        ...Platform.select({
            ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
            android: { elevation: 3 },
        }),
    },
    profileAvatar: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: '#0d9488',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitials: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
    },
    profileName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
    },
    profileEmail: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    profileBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0fdfa',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginTop: 6,
    },
    profileBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0d9488',
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
    groupLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
    },
    rowSub: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
        marginLeft: 52,
    },

    // ── Logout ──────────────────────────
    logoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fecaca',
        ...Platform.select({
            ios: { shadowColor: '#dc2626', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
            android: { elevation: 2 },
        }),
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#dc2626',
        marginLeft: 12,
    },
});

export default ProfessionalSetting;
