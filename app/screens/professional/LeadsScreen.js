import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, Icon, IconNames, FadeInView, AnimatedCard } from '../../components';

const LeadsScreen = () => {
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

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchRequests();
        }, [])
    );

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.REQUEST.GET_REQUESTS_LIST);

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
                message: 'Failed to load client requests. Please try again.',
                icon: 'close-circle',
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
                    <FadeInView delay={100}>
                        <Text className="text-3xl font-bold text-secondary-900 font-primary">
                            Leads
                        </Text>
                    </FadeInView>

                    {requests.length === 0 ? (
                        <FadeInView delay={300} className="flex-1 justify-center items-center py-32">
                            <Text className="text-base text-secondary-400 text-center font-medium">
                                No leads yet.
                            </Text>
                        </FadeInView>
                    ) : (
                        requests.map((request, index) => (
                            <FadeInView key={request.id} delay={200 + index * 100}>
                                <AnimatedCard
                                    onPress={() => navigation.navigate('ProfessionalRequestDetails', { request })}
                                    className="bg-white rounded-[24px] mb-4 shadow-sm border border-secondary-100 overflow-hidden"
                                >
                                    <View className="p-5">
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-lg font-bold text-secondary-900 mb-1">
                                                    {request.clientName}
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <Icon name={IconNames.briefcase} size="xs" color="#94a3b8" style={{ marginRight: 4 }} />
                                                    <Text className="text-sm text-secondary-500 font-medium">
                                                        {getCategoryLabel(request.clientProjectCategory)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className={`px-3 py-1.5 rounded-full flex-row items-center ${getStatusColor(request.status)}`}>
                                                <Icon
                                                    name={request.status === 'new' ? IconNames.notifications : request.status === 'accepted' ? IconNames.checkmarkCircle : IconNames.closeCircle}
                                                    size="xs"
                                                    color="currentColor"
                                                    style={{ marginRight: 4 }}
                                                />
                                                <Text className="text-[10px] font-bold uppercase tracking-wider">
                                                    {getStatusDisplay(request.status)}
                                                </Text>
                                            </View>
                                        </View>

                                        {request.clientProjectDetail && (
                                            <Text
                                                className="text-sm text-secondary-600 mb-4 leading-5"
                                                numberOfLines={2}
                                            >
                                                {request.clientProjectDetail}
                                            </Text>
                                        )}

                                        <View className="flex-row flex-wrap gap-2 mb-4">
                                            {request.clientProjectServicesType && request.clientProjectServicesType.length > 0 && (
                                                request.clientProjectServicesType.slice(0, 3).map((service, sIndex) => (
                                                    <View
                                                        key={sIndex}
                                                        className="bg-secondary-50 px-3 py-1 rounded-lg border border-secondary-100"
                                                    >
                                                        <Text className="text-[10px] font-bold text-secondary-600 uppercase">
                                                            {service}
                                                        </Text>
                                                    </View>
                                                ))
                                            )}
                                        </View>

                                        <View className="flex-row justify-between items-center pt-4 border-t border-secondary-50">
                                            <View className="items-center flex-1">
                                                <Icon name={IconNames.card} size="xs" color="#64748b" style={{ marginBottom: 4 }} />
                                                <Text className="text-[10px] font-bold text-secondary-400 uppercase tracking-tighter mb-1">Budget</Text>
                                                <Text className="text-xs font-bold text-secondary-900">{request.clientProjectBudgetRange}</Text>
                                            </View>
                                            <View className="w-[1px] h-8 bg-secondary-100 mx-2" />
                                            <View className="items-center flex-1">
                                                <Icon name={IconNames.time} size="xs" color="#64748b" style={{ marginBottom: 4 }} />
                                                <Text className="text-[10px] font-bold text-secondary-400 uppercase tracking-tighter mb-1">Timeline</Text>
                                                <Text className="text-xs font-bold text-secondary-900">{request.clientProjectTimeLine}</Text>
                                            </View>
                                            <View className="w-[1px] h-8 bg-secondary-100 mx-2" />
                                            <View className="items-center flex-1">
                                                <Icon name={IconNames.calendar} size="xs" color="#64748b" style={{ marginBottom: 4 }} />
                                                <Text className="text-[10px] font-bold text-secondary-400 uppercase tracking-tighter mb-1">Received</Text>
                                                <Text className="text-xs font-bold text-secondary-900">{formatDate(request.createdAt)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </AnimatedCard>
                            </FadeInView>
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

export default LeadsScreen;
