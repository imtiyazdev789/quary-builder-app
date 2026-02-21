import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, Platform, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { CustomAlert } from '../../components';
import Icon, { IconNames } from '../../components/Icon';
import FadeInView from '../../components/FadeInView';

const ClientSetting = ({ navigation }) => {
    const { logout, user } = useAuth();
    const insets = useSafeAreaInsets();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(true);
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);

    const handleLogout = () => {
        setLogoutAlertVisible(true);
    };

    const confirmLogout = () => {
        setLogoutAlertVisible(false);
        logout();
    };

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

                {/* ── Notifications Group ──────────── */}
                <FadeInView delay={200}>
                    <View style={styles.card}>
                        <Text style={styles.groupLabel}>Notifications</Text>

                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                                <Icon name={IconNames.notifications} size="md" color="#3b82f6" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>Push Notifications</Text>
                                <Text style={styles.rowSub}>Receive alerts about your requests</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#e2e8f0', true: '#99f6e4' }}
                                thumbColor={notificationsEnabled ? '#0d9488' : '#94a3b8'}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: '#f5f3ff' }]}>
                                <Icon name={IconNames.mail} size="md" color="#8b5cf6" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.rowTitle}>Email Updates</Text>
                                <Text style={styles.rowSub}>Get project updates via email</Text>
                            </View>
                            <Switch
                                value={emailUpdatesEnabled}
                                onValueChange={setEmailUpdatesEnabled}
                                trackColor={{ false: '#e2e8f0', true: '#99f6e4' }}
                                thumbColor={emailUpdatesEnabled ? '#0d9488' : '#94a3b8'}
                            />
                        </View>
                    </View>
                </FadeInView>

                {/* ── General Group ────────────────── */}
                <FadeInView delay={350}>
                    <View style={styles.card}>
                        <Text style={styles.groupLabel}>General</Text>

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => Linking.openURL('https://example.com/privacy')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#ecfdf5' }]}>
                                <Icon name={IconNames.shield} size="md" color="#10b981" />
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

export default ClientSetting;
