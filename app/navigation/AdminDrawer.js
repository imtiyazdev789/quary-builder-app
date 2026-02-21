import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminApprovalsScreen from '../screens/admin/AdminApprovalsScreen';
import AdminProjectsScreen from '../screens/admin/AdminProjectsScreen';
import AdminPaymentsScreen from '../screens/admin/AdminPaymentsScreen';
import AdminSupportScreen from '../screens/admin/AdminSupportScreen';
import AdminNotificationsScreen from '../screens/admin/AdminNotificationsScreen';

const Drawer = createDrawerNavigator();

const adminRoutes = [
    { name: 'AdminDashboard', component: AdminDashboard, title: 'Dashboard' },
    { name: 'AdminApprovals', component: AdminApprovalsScreen, title: 'Approvals' },
    { name: 'AdminProjects', component: AdminProjectsScreen, title: 'Projects' },
    { name: 'AdminPayments', component: AdminPaymentsScreen, title: 'Payments' },
    { name: 'AdminSupport', component: AdminSupportScreen, title: 'Support' },
    { name: 'AdminNotifications', component: AdminNotificationsScreen, title: 'Notifications' },
];

const AdminDrawer = () => {
    const { logout } = useAuth();

    const CustomDrawerContent = (props) => (
        <View className="flex-1 bg-white pt-12">
            <View className="px-4 mb-6">
                <Text className="text-2xl font-bold text-secondary-900">Admin Center</Text>
                <Text className="text-sm text-secondary-500">Manage BuildQuery</Text>
            </View>
            <View className="flex-1">
                {props.state.routes.map((route, index) => {
                    const { options } = props.descriptors[route.key];
                    const label = options.title || route.name;
                    const isFocused = props.state.index === index;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => props.navigation.navigate(route.name)}
                            className={`px-4 py-3 ${isFocused ? 'bg-primary-50' : ''}`}
                        >
                            <Text className={`text-base ${isFocused ? 'text-primary-600 font-semibold' : 'text-secondary-700'}`}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <TouchableOpacity onPress={logout} className="px-4 py-3 border-t border-secondary-200">
                <Text className="text-base text-error-600 font-medium">Logout</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0F172A',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            {adminRoutes.map((route) => (
                <Drawer.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={{
                        title: route.title,
                    }}
                />
            ))}
        </Drawer.Navigator>
    );
};

export default AdminDrawer;


