import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CustomAlert, CustomButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';
import Router from '../../config/Router';
import { TOTAL_STEPS } from './request-creation/constants';
import Step1ProjectBasic from './request-creation/Step1ProjectBasic';
import Step2ProjectDetails from './request-creation/Step2ProjectDetails';
import Step3BudgetLocation from './request-creation/Step3BudgetLocation';
import Step4ContactInfo from './request-creation/Step4ContactInfo';

const CreateRequestScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuth();

    // Get professionalId from route params (if navigating from NearbyProfessionals)
    const professionalId = route.params?.professionalId;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Step 1: Project Basics
    const [projectType, setProjectType] = useState('');
    const [projectCategory, setProjectCategory] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);

    // Step 2: Project Details
    const [projectDetail, setProjectDetail] = useState('');
    const [specificRequirements, setSpecificRequirements] = useState('');
    const [timeline, setTimeline] = useState('');

    // Step 3: Budget & Location
    const [budgetRange, setBudgetRange] = useState('');
    const [projectLocation, setProjectLocation] = useState('');
    const [locationData, setLocationData] = useState(null);

    // Step 4: Contact Info
    const [clientName, setClientName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Alert state
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    // Fetch user profile to pre-fill contact info
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setFetchingProfile(true);
            const response = await api.get(Router.USER.GET_PROFILE);
            if (response.data.success && response.data.data) {
                const profile = Array.isArray(response.data.data)
                    ? response.data.data[0]
                    : response.data.data;

                // Pre-fill contact info
                if (profile.firstName && profile.lastName) {
                    setClientName(`${profile.firstName} ${profile.lastName}`.trim());
                }
                if (profile.email) {
                    setEmail(profile.email);
                }
                if (profile.mobileNumber || profile.phone) {
                    setPhoneNumber(profile.mobileNumber || profile.phone || '');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Don't show error, just continue without pre-fill
        } finally {
            setFetchingProfile(false);
        }
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
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

    const validateStep = (step) => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        switch (step) {
            case 1:
                if (!projectType) {
                    newErrors.projectType = 'Please select project type';
                }
                if (!projectCategory) {
                    newErrors.projectCategory = 'Please select project category';
                }
                if (selectedServices.length === 0) {
                    newErrors.selectedServices = 'Please select at least one service';
                }
                break;

            case 2:
                if (!projectDetail.trim() || projectDetail.length < 50) {
                    newErrors.projectDetail = 'Project description must be at least 50 characters';
                }
                if (!timeline) {
                    newErrors.timeline = 'Please select project timeline';
                }
                break;

            case 3:
                if (!budgetRange) {
                    newErrors.budgetRange = 'Please select budget range';
                }
                if (!projectLocation.trim()) {
                    newErrors.projectLocation = 'Project location is required';
                }
                break;

            case 4:
                if (!clientName.trim() || clientName.length < 3 || clientName.length > 20) {
                    newErrors.clientName = 'Name must be between 3 and 20 characters';
                }
                if (!email.trim() || !emailRegex.test(email)) {
                    newErrors.email = 'Valid email is required';
                }
                if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber)) {
                    newErrors.phoneNumber = 'Valid 10-digit phone number is required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        // Check if professionalId is available
        if (!professionalId) {
            showAlert({
                title: 'Professional Required',
                message: 'Please select a professional first from the nearby professionals list, or go back to select one.',
                icon: '⚠️',
                buttons: [
                    {
                        text: 'Go to Professionals',
                        onPress: () => {
                            hideAlert();
                            navigation.navigate('NearbyProfessionals');
                        },
                        style: 'primary'
                    },
                    { text: 'Cancel', onPress: hideAlert, style: 'secondary' },
                ],
            });
            return;
        }

        setLoading(true);

        try {
            const requestPayload = {
                clientId: user?._id || user?.id,
                professionalId: professionalId,
                clientName: clientName.trim(),
                clientProjectType: projectType,
                clientProjectCategory: projectCategory,
                clientProjectServicesType: selectedServices,
                clientProjectBudgetRange: budgetRange,
                clientProjectTimeLine: timeline,
                clientProjectLocation: projectLocation.trim(),
                clientProjectDetail: projectDetail.trim(),
                clientPhoneNumber: phoneNumber.trim(),
                email: email.trim().toLowerCase(),
            };

            // Add optional fields
            if (specificRequirements.trim()) {
                requestPayload.clientProjectSpecificRequirements = specificRequirements.trim();
            }

            const response = await api.post(Router.REQUEST.CREATE_REQUEST, requestPayload);

            if (response.data.success) {
                showAlert({
                    title: 'Request Created!',
                    message: 'Your project request has been submitted successfully. The professional will review and respond soon.',
                    icon: '✅',
                    buttons: [
                        {
                            text: 'View My Requests',
                            onPress: () => {
                                hideAlert();
                                // Navigate to MainTabs and then to MyRequest tab
                                navigation.navigate('MainTabs', { screen: 'MyRequest' });
                            },
                            style: 'primary',
                        },
                    ],
                });
            } else {
                throw new Error(response.data.message || 'Failed to create request');
            }
        } catch (error) {
            console.error('Error creating request:', error);
            let errorMessage = 'Failed to create request. Please try again.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                if (Array.isArray(error.response.data.error)) {
                    errorMessage = error.response.data.error.join(', ');
                } else {
                    errorMessage = error.response.data.error;
                }
            } else if (error.message) {
                errorMessage = error.message;
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

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1ProjectBasic
                        projectType={projectType}
                        setProjectType={setProjectType}
                        projectCategory={projectCategory}
                        setProjectCategory={setProjectCategory}
                        selectedServices={selectedServices}
                        setSelectedServices={setSelectedServices}
                        errors={errors}
                        clearError={clearError}
                    />
                );
            case 2:
                return (
                    <Step2ProjectDetails
                        projectDetail={projectDetail}
                        setProjectDetail={setProjectDetail}
                        specificRequirements={specificRequirements}
                        setSpecificRequirements={setSpecificRequirements}
                        timeline={timeline}
                        setTimeline={setTimeline}
                        errors={errors}
                        clearError={clearError}
                    />
                );
            case 3:
                return (
                    <Step3BudgetLocation
                        budgetRange={budgetRange}
                        setBudgetRange={setBudgetRange}
                        projectLocation={projectLocation}
                        setProjectLocation={setProjectLocation}
                        locationData={locationData}
                        setLocationData={setLocationData}
                        errors={errors}
                        clearError={clearError}
                    />
                );
            case 4:
                return (
                    <Step4ContactInfo
                        clientName={clientName}
                        setClientName={setClientName}
                        email={email}
                        setEmail={setEmail}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        errors={errors}
                        clearError={clearError}
                    />
                );
            default:
                return null;
        }
    };

    if (fetchingProfile) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="bg-white px-4 py-4 border-b border-secondary-200">
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-secondary-900">
                            Create Request
                        </Text>
                        {professionalId && (
                            <Text className="text-xs text-secondary-500 mt-1">
                                Professional selected
                            </Text>
                        )}
                        {!professionalId && (
                            <Text className="text-xs text-warning-600 mt-1">
                                ⚠️ Please select a professional first
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            showAlert({
                                title: 'Cancel Request?',
                                message: 'Are you sure you want to cancel? Your progress will be lost.',
                                icon: '⚠️',
                                buttons: [
                                    {
                                        text: 'Yes, Cancel',
                                        onPress: () => {
                                            hideAlert();
                                            navigation.goBack();
                                        },
                                        style: 'destructive',
                                    },
                                    { text: 'Continue', onPress: hideAlert, style: 'secondary' },
                                ],
                            });
                        }}
                        className="px-3 py-1"
                    >
                        <Text className="text-primary-600 font-medium">Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Indicator */}
                <View className="flex-row items-center mt-2">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
                        <React.Fragment key={step}>
                            <View
                                className={`w-8 h-8 rounded-full items-center justify-center ${step <= currentStep
                                    ? 'bg-primary-600'
                                    : 'bg-secondary-200'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-bold ${step <= currentStep ? 'text-white' : 'text-secondary-500'
                                        }`}
                                >
                                    {step}
                                </Text>
                            </View>
                            {step < TOTAL_STEPS && (
                                <View
                                    className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-primary-600' : 'bg-secondary-200'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </View>
                <Text className="text-xs text-secondary-500 mt-2">
                    Step {currentStep} of {TOTAL_STEPS}
                </Text>
            </View>

            {/* Step Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    {renderStep()}
                </View>
            </ScrollView>

            {/* Navigation Buttons */}
            <View className="bg-white border-t border-secondary-200 px-4 py-4">
                <View className="flex-row justify-between">
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <CustomButton
                            title="Previous"
                            onPress={handlePrevious}
                            disabled={currentStep === 1}
                            variant="secondary"
                        />
                    </View>
                    {currentStep < TOTAL_STEPS ? (
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <CustomButton
                                title="Next"
                                onPress={handleNext}
                                disabled={loading}
                            />
                        </View>
                    ) : (
                        <>
                            {!professionalId && (
                                <TouchableOpacity
                                    className="flex-1 ml-2 bg-warning-600 rounded-xl py-3 px-4 items-center justify-center"
                                    onPress={() => navigation.navigate('NearbyProfessionals')}
                                >
                                    <Text className="text-white font-semibold text-base">
                                        Select Professional First
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {professionalId && (
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <CustomButton
                                        title={loading ? 'Submitting...' : 'Submit Request'}
                                        onPress={handleSubmit}
                                        disabled={loading}
                                    />
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>

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

export default CreateRequestScreen;
