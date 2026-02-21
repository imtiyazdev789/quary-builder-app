import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfessionalTabs from './ProfessionalTabs';
import LeadsScreen from '../screens/professional/LeadsScreen';
import ProjectsScreen from '../screens/professional/ProjectsScreen';
import PortfolioScreen from '../screens/professional/PortfolioScreen';
import ReviewsScreen from '../screens/professional/ReviewsScreen';
import SubscriptionScreen from '../screens/professional/SubscriptionScreen';
import UpdateProfileScreen from '../screens/professional/UpdateProfileScreen';
import ProfessionalRequestDetailsScreen from '../screens/professional/ProfessionalRequestDetailsScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import ChatRoomScreen from '../screens/common/ChatRoomScreen';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';

const Drawer = createDrawerNavigator();

// Icon + hue mapping for each visible drawer route
const drawerMeta = {
    MainTabs: { icon: 'home-outline', hue: '#0d9488' },
    Profile: { icon: 'person-outline', hue: '#6366f1' },
    Leads: { icon: 'mail-outline', hue: '#f59e0b' },
    Projects: { icon: 'folder-outline', hue: '#3b82f6' },
    Portfolio: { icon: 'images-outline', hue: '#ec4899' },
    Reviews: { icon: 'star-outline', hue: '#8b5cf6' },
};

const ProfessionalDrawer = () => {
    const { logout, user } = useAuth();
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);

    const handleLogout = () => {
        setLogoutAlertVisible(true);
    };

    const confirmLogout = () => {
        setLogoutAlertVisible(false);
        logout();
    };

    const getInitials = () => {
        if (!user?.name) return 'P';
        const parts = user.name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    const CustomDrawerContent = (props) => {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
                <View style={{ flex: 1 }}>
                    {/* Gradient Header */}
                    <LinearGradient
                        colors={['#0d9488', '#0f766e']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={ds.header}
                    >
                        <View style={ds.avatarRing}>
                            <View style={ds.avatar}>
                                <Text style={ds.avatarText}>{getInitials()}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={ds.userName} numberOfLines={1}>
                                {user?.name || 'Professional'}
                            </Text>
                            {user?.email && (
                                <Text style={ds.userEmail} numberOfLines={1}>{user.email}</Text>
                            )}
                            <View style={ds.roleBadge}>
                                <Text style={ds.roleBadgeText}>Professional</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Menu Items */}
                    <View style={{ flex: 1, paddingTop: 8 }}>
                        {props.state.routes.map((route, index) => {
                            const { options } = props.descriptors[route.key];
                            const label = options.title || route.name;
                            const isFocused = props.state.index === index;
                            const meta = drawerMeta[route.name];

                            // Skip hidden items
                            if (options.drawerItemStyle && (options.drawerItemStyle.display === 'none' || options.drawerItemStyle.height === 0)) {
                                return null;
                            }
                            if (typeof options.drawerLabel === 'function' && options.drawerLabel() === null) {
                                return null;
                            }

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    onPress={() => props.navigation.navigate(route.name)}
                                    style={[
                                        ds.menuItem,
                                        isFocused && { backgroundColor: '#f0fdfa' },
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <View style={[ds.iconCircle, { backgroundColor: (meta?.hue || '#94a3b8') + '18' }]}>
                                        <Ionicons
                                            name={meta?.icon || 'ellipse-outline'}
                                            size={18}
                                            color={meta?.hue || '#94a3b8'}
                                        />
                                    </View>
                                    <Text style={[
                                        ds.menuLabel,
                                        isFocused && { color: '#0d9488', fontWeight: '700' },
                                    ]}>
                                        {label}
                                    </Text>
                                    {isFocused && <View style={ds.activeDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Logout */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={ds.logoutRow}
                        activeOpacity={0.7}
                    >
                        <View style={[ds.iconCircle, { backgroundColor: '#fef2f2' }]}>
                            <Ionicons name="log-out-outline" size={18} color="#dc2626" />
                        </View>
                        <Text style={ds.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

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
            </SafeAreaView>
        );
    };

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                headerShown: false,
                drawerType: 'front',
                overlayColor: 'rgba(0,0,0,0.2)',
                drawerStyle: {
                    width: '78%',
                    backgroundColor: '#ffffff',
                },
            }}
            initialRouteName="MainTabs"
        >
            <Drawer.Screen
                name="MainTabs"
                component={ProfessionalTabs}
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={UpdateProfileScreen}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="Leads"
                component={LeadsScreen}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="Portfolio"
                component={PortfolioScreen}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="Reviews"
                component={ReviewsScreen}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="ProfessionalRequestDetails"
                component={ProfessionalRequestDetailsScreen}
                options={{
                    swipeEnabled: false,
                    drawerLabel: () => null
                }}
            />
        </Drawer.Navigator>
    );
};

// ─── Shared drawer styles ─── //
const ds = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 22,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarRing: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    userName: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },
    userEmail: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        marginTop: 2,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        marginTop: 6,
    },
    roleBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '700',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 13,
        marginHorizontal: 8,
        borderRadius: 14,
        marginVertical: 1,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#334155',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0d9488',
    },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        marginHorizontal: 8,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#dc2626',
    },
});

export default ProfessionalDrawer;
