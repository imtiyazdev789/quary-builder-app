import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';
import Router from '../../config/Router';

const Dashboard = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const role = user?.role?.toLowerCase() || 'user';

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, [role]);

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
                            {
                                label: 'Total Leads',
                                value: data.totalLeads?.toString() || '0',
                                color: 'text-blue-600',
                            },
                            {
                                label: 'Accepted Leads',
                                value: data.totalLeadsConversion?.toString() || '0',
                                color: 'text-green-600',
                            },
                            {
                                label: 'Projects',
                                value: data.totalProjectsCount?.toString() || '0',
                                color: 'text-purple-600',
                            },
                            {
                                label: 'Avg Rating',
                                value: data.avgRating ? data.avgRating.toFixed(1) : '0.0',
                                color: 'text-orange-600',
                            },
                        ],
                    });
                }
            } else {
                // Client dashboard
                const response = await api.get(Router.USER.GET_DASHBOARD_DETAILS);
                if (response.data.success) {
                    const data = response.data.data;

                    // Map backend response to frontend format
                    const totalRequests = data.TotalRequests || 0;
                    const activeProjects = data.ActiveProjects || 0;
                    const acceptedRequests = data.acceptedRequestCount || 0;
                    const pendingRequests = data.pendingRequestCount || 0;

                    setDashboardData({
                        stats: [
                            {
                                label: 'My Requests',
                                value: totalRequests.toString(),
                                color: 'text-blue-600',
                            },
                            {
                                label: 'Active Projects',
                                value: activeProjects.toString(),
                                color: 'text-green-600',
                            },
                            {
                                label: 'Accepted',
                                value: acceptedRequests.toString(),
                                color: 'text-purple-600',
                            },
                            {
                                label: 'Pending',
                                value: pendingRequests.toString(),
                                color: 'text-orange-600',
                            },
                        ],
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            // Set default values on error
            setDashboardData({
                stats: role === 'professional'
                    ? [
                        { label: 'Total Leads', value: '0', color: 'text-blue-600' },
                        { label: 'Accepted Leads', value: '0', color: 'text-green-600' },
                        { label: 'Projects', value: '0', color: 'text-purple-600' },
                        { label: 'Avg Rating', value: '0.0', color: 'text-orange-600' },
                    ]
                    : [
                        { label: 'My Requests', value: '0', color: 'text-blue-600' },
                        { label: 'Active Projects', value: '0', color: 'text-green-600' },
                        { label: 'Accepted', value: '0', color: 'text-purple-600' },
                        { label: 'Pending', value: '0', color: 'text-orange-600' },
                    ],
            });
        } finally {
            setLoading(false);
        }
    };

    const getDashboardContent = () => {
        const title = role === 'professional' ? 'Professional Dashboard' : 'Client Dashboard';

        return {
            title,
            stats: dashboardData?.stats || [],
        };
    };

    const content = getDashboardContent();

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading dashboard...</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    {/* <Text className="text-3xl font-bold text-gray-900 mb-2">
                        {content.title}
                    </Text> */}
                    <Text className="text-base text-gray-600 mb-6">
                        Welcome to your dashboard
                    </Text>

                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <Text className="text-red-800 text-sm">{error}</Text>
                        </View>
                    )}

                    <View className="flex-row flex-wrap justify-between mb-4">
                        {content.stats.map((stat, index) => (
                            <View
                                key={index}
                                className="bg-white rounded-lg p-4 w-[48%] mb-4 shadow-sm"
                            >
                                <Text className={`text-2xl font-bold ${stat.color} mb-1`}>
                                    {stat.value}
                                </Text>
                                <Text className="text-sm text-gray-600">{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {(role === 'client' || role === 'user') && (
                        <>
                            <TouchableOpacity
                                className="bg-primary-600 rounded-lg p-4 mb-4 shadow-sm"
                                onPress={() => navigation.navigate('CreateRequest')}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-white mb-1">
                                            Create New Request
                                        </Text>
                                        <Text className="text-sm text-primary-100">
                                            Submit a project request to professionals
                                        </Text>
                                    </View>
                                    <Text className="text-3xl ml-3">➕</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-secondary-700 rounded-lg p-4 mb-4 shadow-sm"
                                onPress={() => navigation.navigate('NearbyProfessionals')}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-white mb-1">
                                            Find Nearby Professionals
                                        </Text>
                                        <Text className="text-sm text-secondary-200">
                                            Discover architects, designers & contractors near you
                                        </Text>
                                    </View>
                                    <Text className="text-3xl ml-3">📍</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}

                    <View className="bg-white rounded-lg p-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">
                            Recent Activity
                        </Text>
                        <Text className="text-base text-gray-600">
                            View and manage your activities from here
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Dashboard;
