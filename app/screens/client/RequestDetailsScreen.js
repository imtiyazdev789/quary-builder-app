import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

const RequestDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const request = route.params?.request;

    if (!request) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                        Request Not Found
                    </Text>
                    <Text className="text-base text-gray-600 text-center mb-4">
                        The request details could not be loaded.
                    </Text>
                    <TouchableOpacity
                        className="bg-primary-600 rounded-lg py-3 px-6"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'new':
                return '⏳ New';
            case 'accepted':
                return '✓ Accepted';
            case 'rejected':
                return '✗ Rejected';
            default:
                return status || 'Unknown';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'new':
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'ArchitectureConsultant': 'Architecture',
            'InteriorDesigner': 'Interior Design',
            'StructuralConsultant': 'Structural Engineering',
            'MEPConsultant': 'MEP (Mechanical, Electrical, Plumbing)',
            'Contractor': 'Contractor',
        };
        return labels[category] || category;
    };

    // Currency formatter helper
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            // If it's not a number, return as-is (might be text description)
            return amount;
        }
        return `₹ ${numAmount.toLocaleString('en-IN')}`;
    };

    const DetailSection = ({ title, children, className = '' }) => (
        <View className={`mb-4 ${className}`}>
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {title}
            </Text>
            {children}
        </View>
    );

    const DetailRow = ({ label, value, className = '' }) => (
        <View className={`mb-3 ${className}`}>
            <Text className="text-xs text-gray-500 mb-1">{label}</Text>
            <Text className="text-base text-gray-900 font-medium">{value || 'N/A'}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mr-4"
                >
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900 flex-1">
                    Request Details
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    {/* Header with Status */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1 mr-2">
                                <Text className="text-2xl font-bold text-gray-900 mb-1">
                                    Request Details
                                </Text>
                                <Text className="text-base text-gray-600">
                                    {getCategoryLabel(request.clientProjectCategory)}
                                </Text>
                            </View>
                            <View className={`px-4 py-2 rounded-full border ${getStatusColor(request.status)}`}>
                                <Text className="text-sm font-bold">
                                    {getStatusDisplay(request.status)}
                                </Text>
                            </View>
                        </View>
                        <View className="border-t border-gray-200 pt-3 mt-3">
                            <Text className="text-xs text-gray-500 mb-1">Request ID</Text>
                            <Text className="text-sm text-gray-900 font-mono">
                                {request.id}
                            </Text>
                        </View>
                    </View>

                    {/* Project Information */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <DetailSection title="Project Information">
                            <DetailRow
                                label="Project Type"
                                value={request.clientProjectType}
                            />
                            <DetailRow
                                label="Project Category"
                                value={getCategoryLabel(request.clientProjectCategory)}
                            />
                            <DetailRow
                                label="Project Location"
                                value={request.clientProjectLocation}
                            />
                        </DetailSection>
                    </View>

                    {/* Services */}
                    {request.clientProjectServicesType && request.clientProjectServicesType.length > 0 && (
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <DetailSection title="Required Services">
                                <View className="flex-row flex-wrap gap-2">
                                    {request.clientProjectServicesType.map((service, index) => (
                                        <View
                                            key={index}
                                            className="bg-primary-50 border border-primary-200 px-3 py-2 rounded-lg"
                                        >
                                            <Text className="text-sm text-primary-700 font-medium">
                                                {service}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </DetailSection>
                        </View>
                    )}

                    {/* Budget & Timeline */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <DetailSection title="Budget & Timeline">
                            <View className="flex-row">
                                <View className="flex-1 mr-2">
                                    <DetailRow
                                        label="Budget Range"
                                        value={request.clientProjectBudgetRange}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <DetailRow
                                        label="Project Timeline"
                                        value={request.clientProjectTimeLine}
                                    />
                                </View>
                            </View>
                        </DetailSection>
                    </View>

                    {/* Project Description */}
                    {request.clientProjectDetail && (
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <DetailSection title="Project Description">
                                <Text className="text-base text-gray-900 leading-6">
                                    {request.clientProjectDetail}
                                </Text>
                            </DetailSection>
                        </View>
                    )}

                    {/* Specific Requirements */}
                    {request.clientProjectSpecificRequirements && (
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <DetailSection title="Specific Requirements">
                                <Text className="text-base text-gray-900 leading-6">
                                    {request.clientProjectSpecificRequirements}
                                </Text>
                            </DetailSection>
                        </View>
                    )}

                    {/* Contact Information */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <DetailSection title="Contact Information">
                            <DetailRow
                                label="Client Name"
                                value={request.clientName}
                            />
                            <DetailRow
                                label="Email"
                                value={request.email}
                            />
                            {request.clientPhoneNumber && (
                                <DetailRow
                                    label="Phone Number"
                                    value={request.clientPhoneNumber}
                                />
                            )}
                        </DetailSection>
                    </View>

                    {/* Professional Information */}
                    {request.providerName && (
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <DetailSection title="Assigned Professional">
                                <DetailRow
                                    label="Professional Name"
                                    value={request.providerName}
                                />
                            </DetailSection>
                        </View>
                    )}

                    {/* Acceptance Details - Enhanced Quotation Display */}
                    {request.status === 'accepted' && (
                        <>
                            {request.estimatedQuotation && (
                                <View className="bg-green-50 border-2 border-green-300 rounded-lg p-5 mb-4 shadow-md">
                                    <View className="flex-row items-center mb-3">
                                        <Text className="text-2xl mr-2">💰</Text>
                                        <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                            Estimated Quotation
                                        </Text>
                                    </View>
                                    <Text className="text-3xl font-bold text-green-900 mb-2">
                                        {formatCurrency(request.estimatedQuotation)}
                                    </Text>
                                    {typeof request.estimatedQuotation === 'string' && isNaN(parseFloat(request.estimatedQuotation)) && (
                                        <Text className="text-sm text-green-700 mt-1 italic">
                                            {request.estimatedQuotation}
                                        </Text>
                                    )}
                                </View>
                            )}
                            {request.initialDesignIdea && (
                                <View className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                                    <DetailSection title="Initial Design Idea">
                                        <View className="bg-white rounded-lg p-3 border border-blue-100">
                                            <Text className="text-base text-gray-900 leading-6">
                                                {request.initialDesignIdea}
                                            </Text>
                                        </View>
                                    </DetailSection>
                                </View>
                            )}
                        </>
                    )}

                    {/* Rejection Details */}
                    {request.status === 'rejected' && request.rejectionReason && (
                        <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <DetailSection title="Rejection Reason">
                                <Text className="text-base text-red-900 leading-6">
                                    {request.rejectionReason}
                                </Text>
                            </DetailSection>
                        </View>
                    )}

                    {/* Timestamps */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <DetailSection title="Timeline">
                            <DetailRow
                                label="Created At"
                                value={formatDate(request.createdAt)}
                            />
                            {request.updatedAt && request.updatedAt !== request.createdAt && (
                                <DetailRow
                                    label="Last Updated"
                                    value={formatDate(request.updatedAt)}
                                />
                            )}
                        </DetailSection>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RequestDetailsScreen;
