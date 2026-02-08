import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Added this import
import ClientTabs from './ClientTabs';
import ClientSetting from '../screens/client/ClientSetting';
import NearbyProfessionalsScreen from '../screens/client/NearbyProfessionalsScreen';
import ClientProfile from '../screens/client/ClientProfile';
import CreateRequestScreen from '../screens/client/CreateRequestScreen';
import RequestDetailsScreen from '../screens/client/RequestDetailsScreen';
import CreateReviewScreen from '../screens/client/CreateReviewScreen';
import ProfessionalDetailScreen from '../screens/client/ProfessionalDetailScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import ChatRoomScreen from '../screens/common/ChatRoomScreen';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';

const Drawer = createDrawerNavigator();

const ClientDrawer = () => {
    const { logout, user } = useAuth();
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);

    const handleLogout = () => {
        setLogoutAlertVisible(true);
    };

    const confirmLogout = () => {
        setLogoutAlertVisible(false);
        logout();
    };

    const CustomDrawerContent = (props) => {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
                <View className="flex-1">
                    <View className="px-4 py-6 border-b border-secondary-100">
                        <Text className="text-2xl font-bold text-secondary-900">
                            Client Menu
                        </Text>
                        {user?.email && (
                            <Text className="text-sm text-secondary-500 mt-1">
                                {user.email}
                            </Text>
                        )}
                    </View>
                    <View className="flex-1 pt-2">
                        {props.state.routes.map((route, index) => {
                            const { options } = props.descriptors[route.key];
                            const label = options.title || route.name;
                            const isFocused = props.state.index === index;

                            // Skip hidden items
                            if (options.drawerItemStyle && (options.drawerItemStyle.display === 'none' || options.drawerItemStyle.height === 0)) {
                                return null;
                            }
                            // Also check for explicit drawerLabel: () => null
                            if (typeof options.drawerLabel === 'function' && options.drawerLabel() === null) {
                                return null;
                            }

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    onPress={() => props.navigation.navigate(route.name)}
                                    className={`px-4 py-4 flex-row items-center ${isFocused ? 'bg-primary-50' : ''}`}
                                >
                                    <Text className={`text-base ${isFocused ? 'text-primary-600 font-semibold' : 'text-secondary-700'}`}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="px-4 py-4 border-t border-secondary-200 flex-row items-center"
                    >
                        <Ionicons name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 8 }} />
                        <Text className="text-base text-error-600 font-semibold">
                            Logout
                        </Text>
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
            screenOptions={({ navigation }) => ({
                drawerPosition: 'right',
                drawerType: 'front', // overlay the content instead of pushing it
                overlayColor: 'rgba(0,0,0,0.2)',
                drawerStyle: {
                    width: '78%',
                    backgroundColor: '#ffffff',
                },
                sceneContainerStyle: {
                    backgroundColor: '#ffffff',
                },
                // remove header space entirely
                headerShown: false,
                swipeEdgeWidth: 60,
            })}
        >
            <Drawer.Screen
                name="MainTabs"
                component={ClientTabs}
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="NearbyProfessionals"
                component={NearbyProfessionalsScreen}
                options={{ title: 'Nearby Professionals' }}
            />
            <Drawer.Screen
                name="Profile"
                component={ClientProfile}
                options={{ title: 'Profile' }}
            />
            {/* <Drawer.Screen
                name="Setting"
                component={ClientSetting}
                options={{ title: 'Settings' }}
            /> */}
            <Drawer.Screen
                name="CreateRequest"
                component={CreateRequestScreen}
                options={{ title: 'Create Request' }}
            />
            <Drawer.Screen
                name="RequestDetails"
                component={RequestDetailsScreen}
                options={{ title: 'Request Details' }}
            />
            <Drawer.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notifications' }}
            />
            <Drawer.Screen
                name="CreateReview"
                component={CreateReviewScreen}
                options={{ title: 'Write Review' }}
            />
            <Drawer.Screen
                name="ProfessionalDetail"
                component={ProfessionalDetailScreen}
                options={{
                    title: 'Professional Profile',
                    drawerItemStyle: { display: 'none' } // Hide from drawer menu
                }}
            />
            {/* CHAT FEATURE - TEMPORARILY HIDDEN */}
            {/* <Drawer.Screen
                name="ChatRoom"
                component={ChatRoomScreen}
                options={{
                    title: 'Chat',
                    drawerItemStyle: { display: 'none' } // Hide from drawer menu
                }}
            /> */}
        </Drawer.Navigator>
    );
};

export default ClientDrawer;

