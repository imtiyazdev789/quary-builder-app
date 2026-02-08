import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert } from '../../components';

const MyRequestScreen = () => {
    const navigation = useNavigation();
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
                // Sort by createdAt (newest first)
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

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'new':
                return 'New';
            case 'accepted':
                return 'Accepted';
            case 'rejected':
                return 'Rejected';
            default:
                return status || 'Unknown';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'new':
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'ArchitectureConsultant': 'Architecture',
            'InteriorDesigner': 'Interior Design',
            'StructuralConsultant': 'Structural Engineering',
            'MEPConsultant': 'MEP',
            'Contractor': 'Contractor',
        };
        return labels[category] || category;
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading requests...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0d9488']}
                    />
                }
            >
                <View className="px-6 pt-8 pb-4">
                    <Text className="text-3xl font-bold text-secondary-900 font-primary">
                        Requests
                    </Text>

                    {requests.length === 0 ? (
                        <View className="flex-1 justify-center items-center py-12">
                            <Text className="text-6xl mb-4">📋</Text>
                            <Text className="text-xl font-semibold text-gray-900 mb-2">
                                No Requests Yet
                            </Text>
                            <Text className="text-base text-gray-600 text-center px-6">
                                You haven't created any project requests yet. Create your first request to get started!
                            </Text>
                        </View>
                    ) : (
                        requests.map((request) => (
                            <View
                                key={request.id}
                                className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                                            {getCategoryLabel(request.clientProjectCategory)}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            {request.clientProjectType}
                                        </Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                        <Text className="text-xs font-medium">
                                            {getStatusDisplay(request.status)}
                                        </Text>
                                    </View>
                                </View>

                                {request.clientProjectDetail && (
                                    <Text
                                        className="text-sm text-gray-700 mb-3"
                                        numberOfLines={2}
                                    >
                                        {request.clientProjectDetail}
                                    </Text>
                                )}

                                <View className="flex-row flex-wrap gap-2 mb-3">
                                    {request.clientProjectServicesType && request.clientProjectServicesType.length > 0 && (
                                        request.clientProjectServicesType.slice(0, 3).map((service, index) => (
                                            <View
                                                key={index}
                                                className="bg-primary-50 px-2 py-1 rounded"
                                            >
                                                <Text className="text-xs text-primary-700">
                                                    {service}
                                                </Text>
                                            </View>
                                        ))
                                    )}
                                    {request.clientProjectServicesType && request.clientProjectServicesType.length > 3 && (
                                        <View className="bg-gray-100 px-2 py-1 rounded">
                                            <Text className="text-xs text-gray-600">
                                                +{request.clientProjectServicesType.length - 3} more
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View className="flex-row justify-between items-center mb-3">
                                    <View>
                                        <Text className="text-xs text-gray-500 mb-1">
                                            Budget
                                        </Text>
                                        <Text className="text-sm font-medium text-gray-900">
                                            {request.clientProjectBudgetRange}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-gray-500 mb-1">
                                            Timeline
                                        </Text>
                                        <Text className="text-sm font-medium text-gray-900">
                                            {request.clientProjectTimeLine}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-gray-500 mb-1">
                                            Date
                                        </Text>
                                        <Text className="text-sm font-medium text-gray-900">
                                            {formatDate(request.createdAt)}
                                        </Text>
                                    </View>
                                </View>

                                {request.status === 'accepted' && request.estimatedQuotation && (
                                    <View className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                        <Text className="text-xs font-semibold text-green-800 mb-1">
                                            Estimated Quotation
                                        </Text>
                                        <Text className="text-sm text-green-900">
                                            {request.estimatedQuotation}
                                        </Text>
                                    </View>
                                )}

                                {request.status === 'rejected' && request.rejectionReason && (
                                    <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                        <Text className="text-xs font-semibold text-red-800 mb-1">
                                            Rejection Reason
                                        </Text>
                                        <Text className="text-sm text-red-900">
                                            {request.rejectionReason}
                                        </Text>
                                    </View>
                                )}

                                {request.providerName && (
                                    <View className="mb-3">
                                        <Text className="text-xs text-gray-500">
                                            Professional: <Text className="font-medium text-gray-900">{request.providerName}</Text>
                                        </Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    className="bg-primary-600 rounded-lg py-2 px-4"
                                    onPress={() => navigation.navigate('RequestDetails', { request })}
                                >
                                    <Text className="text-white text-center font-medium">
                                        View Details
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
        </SafeAreaView>
    );
};

export default MyRequestScreen;
