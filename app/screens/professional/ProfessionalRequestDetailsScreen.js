import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, InputField } from '../../components';

const ProfessionalRequestDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const request = route.params?.request;
    const scrollViewRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [showAcceptForm, setShowAcceptForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [estimatedQuotation, setEstimatedQuotation] = useState('');
    const [initialDesignIdea, setInitialDesignIdea] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [errors, setErrors] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

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

    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateAcceptForm = () => {
        const newErrors = {};
        if (!estimatedQuotation.trim()) {
            newErrors.estimatedQuotation = 'Estimated quotation is required';
        }
        // initialDesignIdea is now optional - no validation required
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRejectForm = () => {
        const newErrors = {};
        if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
            newErrors.rejectionReason = 'Rejection reason must be at least 10 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAccept = async () => {
        if (!validateAcceptForm()) return;

        setLoading(true);
        try {
            const payload = {
                status: 'accepted',
                estimatedQuotation: estimatedQuotation.trim(),
            };
            // Only include initialDesignIdea if provided
            if (initialDesignIdea.trim()) {
                payload.initialDesignIdea = initialDesignIdea.trim();
            }

            const response = await api.patch(
                Router.REQUEST.UPDATE_REQUEST_STATUS(request.id),
                payload
            );

            if (response.data.success) {
                showAlert({
                    title: 'Request Accepted!',
                    message: 'The client has been notified of your acceptance. They will receive an email with your contact details.',
                    icon: '✅',
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => {
                                hideAlert();
                                navigation.goBack();
                            },
                            style: 'primary',
                        },
                    ],
                });
            } else {
                throw new Error(response.data.message || 'Failed to accept request');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            let errorMessage = 'Failed to accept request. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            showAlert({
                title: 'Error',
                message: errorMessage,
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!validateRejectForm()) return;

        setLoading(true);
        try {
            const response = await api.patch(
                Router.REQUEST.UPDATE_REQUEST_STATUS(request.id),
                {
                    status: 'rejected',
                    rejectionReason: rejectionReason.trim(),
                }
            );

            if (response.data.success) {
                showAlert({
                    title: 'Request Rejected',
                    message: 'The client has been notified of your rejection.',
                    icon: '⚠️',
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => {
                                hideAlert();
                                navigation.goBack();
                            },
                            style: 'primary',
                        },
                    ],
                });
            } else {
                throw new Error(response.data.message || 'Failed to reject request');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            let errorMessage = 'Failed to reject request. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            showAlert({
                title: 'Error',
                message: errorMessage,
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 50 }}
                >
                    <View className="px-4 py-6">
                        {/* Header with Status */}
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1 mr-2">
                                    <Text className="text-2xl font-bold text-gray-900 mb-1">
                                        {request.clientName}
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

                        {/* Contact Information - Prominent Section (Moved to top) */}
                        <View className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
                            <DetailSection title="Client Contact Information">
                                <Text className="text-xs text-gray-600 mb-3">
                                    Contact the client directly using the information below
                                </Text>
                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Client Name</Text>
                                    <Text className="text-base text-gray-900 font-semibold">{request.clientName || 'N/A'}</Text>
                                </View>
                                {request.clientPhoneNumber && (
                                    <TouchableOpacity
                                        className="mb-3"
                                        onPress={() => {
                                            Linking.openURL(`tel:${request.clientPhoneNumber}`);
                                        }}
                                    >
                                        <Text className="text-xs text-gray-500 mb-1">Phone Number</Text>
                                        <View className="flex-row items-center">
                                            <Text className="text-base text-blue-600 font-semibold underline">
                                                {request.clientPhoneNumber}
                                            </Text>
                                            <Text className="text-blue-600 ml-2 text-lg">📞</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL(`mailto:${request.email}`);
                                    }}
                                >
                                    <Text className="text-xs text-gray-500 mb-1">Email</Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-base text-blue-600 font-semibold underline">
                                            {request.email}
                                        </Text>
                                        <Text className="text-blue-600 ml-2 text-lg">✉️</Text>
                                    </View>
                                </TouchableOpacity>
                            </DetailSection>
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

                        {/* Timestamps */}
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <DetailSection title="Timeline">
                                <DetailRow
                                    label="Created At"
                                    value={formatDate(request.createdAt)}
                                />
                            </DetailSection>
                        </View>

                        {/* Action Buttons - Only show for new requests */}
                        {request.status === 'new' && !showAcceptForm && !showRejectForm && (
                            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                <DetailSection title="Actions">
                                    <View className="flex-row gap-3">
                                        <TouchableOpacity
                                            className="flex-1 bg-green-600 rounded-lg py-3 px-4"
                                            onPress={() => {
                                                setShowAcceptForm(true);
                                                setShowRejectForm(false);
                                            }}
                                        >
                                            <Text className="text-white text-center font-semibold">
                                                Accept Request
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className="flex-1 bg-red-600 rounded-lg py-3 px-4"
                                            onPress={() => {
                                                setShowRejectForm(true);
                                                setShowAcceptForm(false);
                                            }}
                                        >
                                            <Text className="text-white text-center font-semibold">
                                                Reject Request
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </DetailSection>
                            </View>
                        )}

                        {/* Accept Form */}
                        {showAcceptForm && request.status === 'new' && (
                            <View className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                                <Text className="text-lg font-bold text-green-900 mb-4">
                                    Accept Request
                                </Text>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-800 mb-2">
                                        Estimated Quotation * {estimatedQuotation.length > 0 && `(${estimatedQuotation.length} characters)`}
                                    </Text>
                                    <TextInput
                                        className={`border rounded-xl px-4 py-3 text-base bg-white ${errors.estimatedQuotation ? 'border-error-500' : 'border-gray-200'
                                            }`}
                                        placeholder="Enter estimated quotation amount..."
                                        placeholderTextColor="#94a3b8"
                                        value={estimatedQuotation}
                                        onChangeText={(text) => {
                                            setEstimatedQuotation(text);
                                            clearError('estimatedQuotation');
                                        }}
                                        multiline
                                        numberOfLines={2}
                                        style={{ textAlignVertical: 'top' }}
                                    />
                                    {errors.estimatedQuotation && (
                                        <Text className="text-error-500 text-xs mt-1 ml-1">
                                            {errors.estimatedQuotation}
                                        </Text>
                                    )}
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-800 mb-2">
                                        Initial Design Idea (Optional) {initialDesignIdea.length > 0 && `(${initialDesignIdea.length} characters)`}
                                    </Text>
                                    <TextInput
                                        className={`border rounded-xl px-4 py-3 text-base bg-white h-32 ${errors.initialDesignIdea ? 'border-error-500' : 'border-gray-200'
                                            }`}
                                        placeholder="Describe your initial design ideas and approach (optional)..."
                                        placeholderTextColor="#94a3b8"
                                        value={initialDesignIdea}
                                        onChangeText={(text) => {
                                            setInitialDesignIdea(text);
                                            clearError('initialDesignIdea');
                                        }}
                                        multiline
                                        numberOfLines={8}
                                        style={{ textAlignVertical: 'top' }}
                                        maxLength={1000}
                                    />
                                    {errors.initialDesignIdea && (
                                        <Text className="text-error-500 text-xs mt-1 ml-1">
                                            {errors.initialDesignIdea}
                                        </Text>
                                    )}
                                    <Text className="text-xs text-gray-500 mt-1 ml-1">
                                        {1000 - initialDesignIdea.length} characters remaining.
                                    </Text>
                                </View>

                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        className="flex-1 bg-gray-600 rounded-lg py-3 px-4"
                                        onPress={() => {
                                            setShowAcceptForm(false);
                                            setEstimatedQuotation('');
                                            setInitialDesignIdea('');
                                            setErrors({});
                                        }}
                                        disabled={loading}
                                    >
                                        <Text className="text-white text-center font-semibold">
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-1 bg-green-600 rounded-lg py-3 px-4"
                                        onPress={handleAccept}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text className="text-white text-center font-semibold">
                                                Submit Acceptance
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Reject Form */}
                        {showRejectForm && request.status === 'new' && (
                            <View className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                                <Text className="text-lg font-bold text-red-900 mb-4">
                                    Reject Request
                                </Text>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-800 mb-2">
                                        Rejection Reason * {rejectionReason.length > 0 && `(${rejectionReason.length} characters)`}
                                    </Text>
                                    <TextInput
                                        className={`border rounded-xl px-4 py-3 text-base bg-white h-32 ${errors.rejectionReason ? 'border-error-500' : 'border-gray-200'
                                            }`}
                                        placeholder="Please provide a reason for rejecting this request..."
                                        placeholderTextColor="#94a3b8"
                                        value={rejectionReason}
                                        onChangeText={(text) => {
                                            setRejectionReason(text);
                                            clearError('rejectionReason');
                                        }}
                                        multiline
                                        numberOfLines={8}
                                        style={{ textAlignVertical: 'top' }}
                                        maxLength={500}
                                    />
                                    {errors.rejectionReason && (
                                        <Text className="text-error-500 text-xs mt-1 ml-1">
                                            {errors.rejectionReason}
                                        </Text>
                                    )}
                                    <Text className="text-xs text-gray-500 mt-1 ml-1">
                                        Minimum 10 characters. {500 - rejectionReason.length} characters remaining.
                                    </Text>
                                </View>

                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        className="flex-1 bg-gray-600 rounded-lg py-3 px-4"
                                        onPress={() => {
                                            setShowRejectForm(false);
                                            setRejectionReason('');
                                            setErrors({});
                                        }}
                                        disabled={loading}
                                    >
                                        <Text className="text-white text-center font-semibold">
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-1 bg-red-600 rounded-lg py-3 px-4"
                                        onPress={handleReject}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text className="text-white text-center font-semibold">
                                                Submit Rejection
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Already Accepted/Rejected Status */}
                        {request.status !== 'new' && (
                            <View>
                                <View className={`rounded-lg p-4 mb-4 ${request.status === 'accepted'
                                    ? 'bg-green-50 border-2 border-green-200'
                                    : 'bg-red-50 border-2 border-red-200'
                                    }`}>
                                    <Text className={`text-lg font-bold mb-2 ${request.status === 'accepted' ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                        Request {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                                    </Text>
                                    {request.status === 'accepted' && request.estimatedQuotation && (
                                        <View className="mb-3">
                                            <Text className="text-sm font-semibold text-green-800 mb-1">
                                                Estimated Quotation:
                                            </Text>
                                            <Text className="text-base text-green-900">
                                                {request.estimatedQuotation}
                                            </Text>
                                        </View>
                                    )}
                                    {request.status === 'accepted' && request.initialDesignIdea && (
                                        <View className="mb-3">
                                            <Text className="text-sm font-semibold text-green-800 mb-1">
                                                Initial Design Idea:
                                            </Text>
                                            <Text className="text-base text-green-900">
                                                {request.initialDesignIdea}
                                            </Text>
                                        </View>
                                    )}
                                    {request.status === 'rejected' && request.rejectionReason && (
                                        <View>
                                            <Text className="text-sm font-semibold text-red-800 mb-1">
                                                Rejection Reason:
                                            </Text>
                                            <Text className="text-base text-red-900">
                                                {request.rejectionReason}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* CHAT FEATURE - TEMPORARILY HIDDEN */}
                                {/* Chat Button for Accepted Requests */}
                                {/* {request.status === 'accepted' && (
                                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                        <DetailSection title="Communication">
                                            <TouchableOpacity
                                                className="bg-primary-600 rounded-lg py-3 px-4 flex-row justify-center items-center"
                                                onPress={async () => {
                                                    setLoading(true);
                                                    try {
                                                        // Fetch conversation by request ID
                                                        const response = await api.get(Router.CHAT.GET_CONVERSATION_BY_REQUEST(request._id || request.id));
                                                        if (response.data.success && response.data.data) {
                                                            // Navigate to ChatRoom with conversation data
                                                            navigation.navigate('ChatRoom', { conversation: response.data.data });
                                                        } else {
                                                            showAlert({
                                                                title: 'Chat Not Available',
                                                                message: 'Could not find an active conversation for this request.',
                                                                icon: '💬',
                                                                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }]
                                                            });
                                                        }
                                                    } catch (error) {
                                                        console.error('Error fetching conversation:', error);
                                                        showAlert({
                                                            title: 'Error',
                                                            message: 'Failed to open chat. Please try again.',
                                                            icon: '❌',
                                                            buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }]
                                                        });
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color="#fff" size="small" />
                                                ) : (
                                                    <>
                                                        <Text className="text-lg mr-2">💬</Text>
                                                        <Text className="text-white font-semibold text-base">
                                                            Chat with Client
                                                        </Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </DetailSection>
                                    </View>
                                )} */}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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

export default ProfessionalRequestDetailsScreen;
