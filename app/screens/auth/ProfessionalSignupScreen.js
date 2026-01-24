import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomAlert, CustomButton } from '../../components';
import api from '../../config/axios';
import useProfessionalSignupStore from '../../store/useProfessionalSignupStore';
import Step1BusinessInfo from './professional-signup/Step1BusinessInfo';
import Step2Location from './professional-signup/Step2Location';
import Step3Contact from './professional-signup/Step3Contact';
import Step4Representative from './professional-signup/Step4Representative';
import Step5KycDocuments from './professional-signup/Step5KycDocuments';
import Step6AboutBusiness from './professional-signup/Step6AboutBusiness';
import Step7PasswordDeclaration from './professional-signup/Step7PasswordDeclaration';
import { TOTAL_STEPS } from './professional-signup/constants';

const ProfessionalSignupScreen = ({ navigation }) => {
    // Zustand store for persisting form data
    const store = useProfessionalSignupStore();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from store
    const [currentStep, setCurrentStep] = useState(store.currentStep);

    // Step 1: Business Info
    const [businessName, setBusinessName] = useState(store.businessName);
    const [businessType, setBusinessType] = useState(store.businessType);
    const [category, setCategory] = useState(store.category);
    const [dateOfEstablishment, setDateOfEstablishment] = useState(store.dateOfEstablishment);

    // Step 2: Location
    const [coordinates, setCoordinates] = useState(store.coordinates);
    const [addressLine1, setAddressLine1] = useState(store.addressLine1);
    const [addressLine2, setAddressLine2] = useState(store.addressLine2);
    const [city, setCity] = useState(store.city);
    const [district, setDistrict] = useState(store.district);
    const [state, setState] = useState(store.state);
    const [pincode, setPincode] = useState(store.pincode);

    // Step 3: Company Contact
    const [companyEmail, setCompanyEmail] = useState(store.companyEmail);
    const [companyPhone, setCompanyPhone] = useState(store.companyPhone);
    const [whatsappNumber, setWhatsappNumber] = useState(store.whatsappNumber);
    const [websiteUrl, setWebsiteUrl] = useState(store.websiteUrl);

    // Step 4: Representative
    const [representativeName, setRepresentativeName] = useState(store.representativeName);
    const [designation, setDesignation] = useState(store.designation);
    const [representativeMobile, setRepresentativeMobile] = useState(store.representativeMobile);
    const [representativeEmail, setRepresentativeEmail] = useState(store.representativeEmail);

    // Step 5: KYC & Documents (documents not persisted, start fresh)
    const [kycIdType, setKycIdType] = useState(store.kycIdType);
    const [kycIdDocument, setKycIdDocument] = useState(null);
    const [logo, setLogo] = useState(null);
    const [companyRegistrationDoc, setCompanyRegistrationDoc] = useState(null);
    const [coaRegistrationDoc, setCoaRegistrationDoc] = useState(null);
    const [structuralRegistrationDoc, setStructuralRegistrationDoc] = useState(null);
    const [constructionLicenseDoc, setConstructionLicenseDoc] = useState(null);
    const [gstDocument, setGstDocument] = useState(null);
    const [gstNumber, setGstNumber] = useState(store.gstNumber);

    // Step 6: About Business
    const [shortDescription, setShortDescription] = useState(store.shortDescription);
    const [detailedDescription, setDetailedDescription] = useState(store.detailedDescription);
    const [selectedServices, setSelectedServices] = useState(store.selectedServices);
    const [tagline, setTagline] = useState(store.tagline);

    // Step 7: Password & Declaration (never persisted for security)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [declarationAccepted, setDeclarationAccepted] = useState(false);

    // Custom Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    // Check for saved progress on mount
    useEffect(() => {
        if (store.hasSavedProgress() && !isInitialized) {
            setIsInitialized(true);
            showCustomAlert({
                title: 'Resume Registration?',
                message: 'You have saved progress. Would you like to continue where you left off?',
                icon: '📋',
                buttons: [
                    {
                        text: 'Start Fresh',
                        onPress: () => {
                            store.resetForm();
                            setCurrentStep(1);
                            resetLocalState();
                            hideAlert();
                        },
                        style: 'outline'
                    },
                    {
                        text: 'Continue',
                        onPress: () => {
                            hideAlert();
                        },
                        style: 'primary'
                    }
                ],
            });
        } else {
            setIsInitialized(true);
        }
    }, []);

    // Sync current step to store
    useEffect(() => {
        store.setCurrentStep(currentStep);
    }, [currentStep]);

    // Sync form data to store when navigating
    const syncToStore = () => {
        store.updateFields({
            businessName,
            businessType,
            category,
            dateOfEstablishment,
            coordinates,
            addressLine1,
            addressLine2,
            city,
            district,
            state,
            pincode,
            companyEmail,
            companyPhone,
            whatsappNumber,
            websiteUrl,
            representativeName,
            designation,
            representativeMobile,
            representativeEmail,
            kycIdType,
            gstNumber,
            shortDescription,
            detailedDescription,
            selectedServices,
            tagline,
        });
    };

    // Reset local state
    const resetLocalState = () => {
        setBusinessName('');
        setBusinessType('');
        setCategory('');
        setDateOfEstablishment('');
        setCoordinates(null);
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setDistrict('');
        setState('');
        setPincode('');
        setCompanyEmail('');
        setCompanyPhone('');
        setWhatsappNumber('');
        setWebsiteUrl('');
        setRepresentativeName('');
        setDesignation('');
        setRepresentativeMobile('');
        setRepresentativeEmail('');
        setKycIdType('');
        setKycIdDocument(null);
        setLogo(null);
        setCompanyRegistrationDoc(null);
        setCoaRegistrationDoc(null);
        setStructuralRegistrationDoc(null);
        setConstructionLicenseDoc(null);
        setGstDocument(null);
        setGstNumber('');
        setShortDescription('');
        setDetailedDescription('');
        setSelectedServices([]);
        setTagline('');
        setPassword('');
        setConfirmPassword('');
        setDeclarationAccepted(false);
    };

    const showCustomAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    // Clear specific field error
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Clear category-specific documents when category changes
    useEffect(() => {
        // Clear all category-specific documents when category changes
        setCoaRegistrationDoc(null);
        setStructuralRegistrationDoc(null);
        setConstructionLicenseDoc(null);
        // Clear related errors (use functional update to avoid stale closure)
        setErrors(prev => ({
            ...prev,
            coaRegistrationDoc: '',
            structuralRegistrationDoc: '',
            constructionLicenseDoc: '',
        }));
    }, [category]);

    // Clear company registration doc when business type changes (if no longer required)
    useEffect(() => {
        if (businessType !== 'Partnership/LLP' && businessType !== 'PrivateLimited/Company') {
            setCompanyRegistrationDoc(null);
            // Clear related error (use functional update to avoid stale closure)
            setErrors(prev => ({ ...prev, companyRegistrationDoc: '' }));
        }
    }, [businessType]);

    // Toggle service selection
    const toggleService = (service) => {
        const newServices = selectedServices.includes(service)
            ? selectedServices.filter(s => s !== service)
            : [...selectedServices, service];
        setSelectedServices(newServices);
    };

    // Handle back navigation
    const handleBack = () => {
        if (currentStep > 1) {
            syncToStore();
            setCurrentStep(currentStep - 1);
        } else {
            // If on first step, ask if they want to save progress
            if (store.hasSavedProgress()) {
                showCustomAlert({
                    title: 'Save Progress?',
                    message: 'Your progress will be saved. You can continue later.',
                    icon: '💾',
                    buttons: [
                        {
                            text: 'Discard',
                            onPress: () => {
                                store.resetForm();
                                hideAlert();
                                navigation.goBack();
                            },
                            style: 'outline'
                        },
                        {
                            text: 'Save & Exit',
                            onPress: () => {
                                syncToStore();
                                hideAlert();
                                navigation.goBack();
                            },
                            style: 'primary'
                        }
                    ],
                });
            } else {
                navigation.goBack();
            }
        }
    };

    // Validation for each step
    const validateStep = (step) => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const pincodeRegex = /^[1-9][0-9]{5}$/;

        switch (step) {
            case 1:
                if (!businessName.trim() || businessName.length < 2) {
                    newErrors.businessName = 'Business name is required (min 2 characters)';
                }
                if (!businessType) {
                    newErrors.businessType = 'Please select business type';
                }
                if (!category) {
                    newErrors.category = 'Please select category';
                }
                if (!dateOfEstablishment) {
                    newErrors.dateOfEstablishment = 'Date of establishment is required';
                }
                break;

            case 2:
                if (!state.trim()) newErrors.state = 'State is required';
                if (!district.trim()) newErrors.district = 'District is required';
                if (!city.trim()) newErrors.city = 'City is required';
                if (!pincode.trim() || !pincodeRegex.test(pincode)) {
                    newErrors.pincode = 'Valid 6-digit pincode is required';
                }
                break;

            case 3:
                if (!companyEmail.trim() || !emailRegex.test(companyEmail)) {
                    newErrors.companyEmail = 'Valid company email is required';
                }
                if (!companyPhone.trim() || !phoneRegex.test(companyPhone)) {
                    newErrors.companyPhone = 'Valid 10-digit phone is required';
                }
                break;

            case 4:
                if (!representativeName.trim()) {
                    newErrors.representativeName = 'Representative name is required';
                }
                if (!designation) {
                    newErrors.designation = 'Please select designation';
                }
                if (!representativeMobile.trim() || !phoneRegex.test(representativeMobile)) {
                    newErrors.representativeMobile = 'Valid 10-digit mobile is required';
                }
                if (!representativeEmail.trim() || !emailRegex.test(representativeEmail)) {
                    newErrors.representativeEmail = 'Valid email is required';
                }
                break;

            case 5:
                if (!kycIdType) {
                    newErrors.kycIdType = 'Please select KYC document type';
                }
                if (!kycIdDocument) {
                    newErrors.kycIdDocument = 'KYC document is required';
                }
                if (!logo) {
                    newErrors.logo = 'Company logo is required';
                }
                // Conditional document requirements
                if ((businessType === 'Partnership/LLP' || businessType === 'PrivateLimited/Company') && !companyRegistrationDoc) {
                    newErrors.companyRegistrationDoc = 'Company registration document is required';
                }
                if (category === 'ArchitectureConsultant' && !coaRegistrationDoc) {
                    newErrors.coaRegistrationDoc = 'COA registration document is required';
                }
                if (category === 'StructuralConsultant' && !structuralRegistrationDoc) {
                    newErrors.structuralRegistrationDoc = 'Structural registration document is required';
                }
                if (category === 'Contractor' && !constructionLicenseDoc) {
                    newErrors.constructionLicenseDoc = 'Construction license is required';
                }
                break;

            case 6:
                const wordCount = shortDescription.trim().split(/\s+/).filter(Boolean).length;
                if (wordCount < 25 || wordCount > 150) {
                    newErrors.shortDescription = `Short description must be 25-150 words (currently ${wordCount} words)`;
                }
                if (!detailedDescription.trim() || detailedDescription.length < 100) {
                    newErrors.detailedDescription = 'Detailed description is required (min 100 characters)';
                }
                if (selectedServices.length === 0) {
                    newErrors.services = 'Please select at least one service';
                }
                break;

            case 7:
                if (!password || password.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                }
                if (password !== confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
                if (!declarationAccepted) {
                    newErrors.declaration = 'Please accept the declaration';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle next step
    const handleNext = () => {
        if (validateStep(currentStep)) {
            syncToStore();
            setCurrentStep(currentStep + 1);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        if (currentStep > 1) {
            syncToStore();
            setCurrentStep(currentStep - 1);
        }
    };

    // Submit registration
    const handleSubmit = async () => {
        if (!validateStep(7)) return;

        setLoading(true);

        try {
            // Create FormData for multipart upload
            const formData = new FormData();

            // Step 1 data
            formData.append('businessName', businessName);
            formData.append('businessType', businessType);
            formData.append('category', category);
            formData.append('dateOfEstablishment', dateOfEstablishment);

            // Step 2 data
            formData.append('state', state);
            formData.append('district', district);
            formData.append('city', city);
            formData.append('pincode', pincode);
            
            // Fix: Stringify nested objects for multer
            const registeredAddressObj = {
                line1: addressLine1,
                line2: addressLine2
            };
            formData.append('registeredAddress', JSON.stringify(registeredAddressObj));
            
            formData.append('formattedAddress', `${addressLine1}, ${addressLine2}, ${city}, ${district}, ${state} - ${pincode}`);
            
            if (coordinates) {
                const locationObj = {
                    type: 'Point',
                    coordinates: [coordinates.longitude, coordinates.latitude]
                };
                formData.append('location', JSON.stringify(locationObj));
            }

            // Step 3 data
            formData.append('companyEmail', companyEmail.toLowerCase());
            formData.append('companyPhone', companyPhone);
            if (whatsappNumber) formData.append('whatsappNumber', whatsappNumber);
            if (websiteUrl) formData.append('websiteUrl', websiteUrl);

            // Step 4 data
            formData.append('representativeName', representativeName);
            formData.append('designation', designation);
            formData.append('representativeMobile', representativeMobile);
            formData.append('representativeEmail', representativeEmail.toLowerCase());

            // Step 5 data
            formData.append('kycIdType', kycIdType);
            if (gstNumber) formData.append('gstNumber', gstNumber);

            // Step 6 data
            formData.append('shortDescription', shortDescription);
            formData.append('detailedDescription', detailedDescription);
            formData.append('services', JSON.stringify(selectedServices));
            if (tagline) formData.append('tagline', tagline);

            // Step 7 data
            formData.append('password', password);
            formData.append('declarationAccepted', 'true');

            // Append files
            if (logo) {
                formData.append('logo', {
                    uri: logo.uri,
                    type: 'image/jpeg',
                    name: 'logo.jpg',
                });
            }

            if (kycIdDocument) {
                formData.append('kycIdDocument', {
                    uri: kycIdDocument.uri,
                    type: kycIdDocument.mimeType || 'application/pdf',
                    name: kycIdDocument.name || 'kyc_document.pdf',
                });
            }

            if (companyRegistrationDoc) {
                formData.append('companyRegistrationDoc', {
                    uri: companyRegistrationDoc.uri,
                    type: companyRegistrationDoc.mimeType || 'application/pdf',
                    name: companyRegistrationDoc.name || 'company_registration.pdf',
                });
            }

            if (coaRegistrationDoc) {
                formData.append('coaRegistrationDoc', {
                    uri: coaRegistrationDoc.uri,
                    type: coaRegistrationDoc.mimeType || 'application/pdf',
                    name: coaRegistrationDoc.name || 'coa_registration.pdf',
                });
            }

            if (structuralRegistrationDoc) {
                formData.append('structuralRegistrationDoc', {
                    uri: structuralRegistrationDoc.uri,
                    type: structuralRegistrationDoc.mimeType || 'application/pdf',
                    name: structuralRegistrationDoc.name || 'structural_registration.pdf',
                });
            }

            if (constructionLicenseDoc) {
                formData.append('constructionLicenseDoc', {
                    uri: constructionLicenseDoc.uri,
                    type: constructionLicenseDoc.mimeType || 'application/pdf',
                    name: constructionLicenseDoc.name || 'construction_license.pdf',
                });
            }

            if (gstDocument) {
                formData.append('gstDocument', {
                    uri: gstDocument.uri,
                    type: gstDocument.mimeType || 'application/pdf',
                    name: gstDocument.name || 'gst_document.pdf',
                });
            }

            console.log('Submitting professional registration...');

            const response = await api.post('/auth/professional/newregister', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Registration response:', response.data);

            if (response.data.success) {
                // Clear saved form data after successful registration
                store.resetForm();

                // Navigate to OTP verification
                navigation.navigate('OTPVerification', {
                    emailVerificationId: response.data.data.verificationId,
                    email: representativeEmail,
                    role: 'professional',
                    showSuccessMessage: true,
                });
            } else {
                showCustomAlert({
                    title: 'Registration Failed',
                    message: response.data.message || 'Something went wrong. Please try again.',
                    icon: '❌',
                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                });
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            showCustomAlert({
                title: 'Registration Failed',
                message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setLoading(false);
        }
    };

    // Render step content
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1BusinessInfo
                        businessName={businessName}
                        setBusinessName={setBusinessName}
                        businessType={businessType}
                        setBusinessType={setBusinessType}
                        category={category}
                        setCategory={setCategory}
                        dateOfEstablishment={dateOfEstablishment}
                        setDateOfEstablishment={setDateOfEstablishment}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            case 2:
                return (
                    <Step2Location
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                        addressLine1={addressLine1}
                        setAddressLine1={setAddressLine1}
                        addressLine2={addressLine2}
                        setAddressLine2={setAddressLine2}
                        city={city}
                        setCity={setCity}
                        district={district}
                        setDistrict={setDistrict}
                        state={state}
                        setState={setState}
                        pincode={pincode}
                        setPincode={setPincode}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            case 3:
                return (
                    <Step3Contact
                        companyEmail={companyEmail}
                        setCompanyEmail={setCompanyEmail}
                        companyPhone={companyPhone}
                        setCompanyPhone={setCompanyPhone}
                        whatsappNumber={whatsappNumber}
                        setWhatsappNumber={setWhatsappNumber}
                        websiteUrl={websiteUrl}
                        setWebsiteUrl={setWebsiteUrl}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            case 4:
                return (
                    <Step4Representative
                        representativeName={representativeName}
                        setRepresentativeName={setRepresentativeName}
                        designation={designation}
                        setDesignation={setDesignation}
                        representativeMobile={representativeMobile}
                        setRepresentativeMobile={setRepresentativeMobile}
                        representativeEmail={representativeEmail}
                        setRepresentativeEmail={setRepresentativeEmail}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            case 5:
                return (
                    <Step5KycDocuments
                        businessType={businessType}
                        category={category}
                        kycIdType={kycIdType}
                        setKycIdType={setKycIdType}
                        kycIdDocument={kycIdDocument}
                        setKycIdDocument={setKycIdDocument}
                        logo={logo}
                        setLogo={setLogo}
                        companyRegistrationDoc={companyRegistrationDoc}
                        setCompanyRegistrationDoc={setCompanyRegistrationDoc}
                        coaRegistrationDoc={coaRegistrationDoc}
                        setCoaRegistrationDoc={setCoaRegistrationDoc}
                        structuralRegistrationDoc={structuralRegistrationDoc}
                        setStructuralRegistrationDoc={setStructuralRegistrationDoc}
                        constructionLicenseDoc={constructionLicenseDoc}
                        setConstructionLicenseDoc={setConstructionLicenseDoc}
                        gstDocument={gstDocument}
                        setGstDocument={setGstDocument}
                        gstNumber={gstNumber}
                        setGstNumber={setGstNumber}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            case 6:
                return (
                    <Step6AboutBusiness
                        tagline={tagline}
                        setTagline={setTagline}
                        shortDescription={shortDescription}
                        setShortDescription={setShortDescription}
                        detailedDescription={detailedDescription}
                        setDetailedDescription={setDetailedDescription}
                        selectedServices={selectedServices}
                        toggleService={toggleService}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            case 7:
                return (
                    <Step7PasswordDeclaration
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        showConfirmPassword={showConfirmPassword}
                        setShowConfirmPassword={setShowConfirmPassword}
                        declarationAccepted={declarationAccepted}
                        setDeclarationAccepted={setDeclarationAccepted}
                        errors={errors}
                        clearError={clearError}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            {/* Progress bar */}
            <View className="px-6 pt-4 pb-2">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-secondary-500">Step {currentStep} of {TOTAL_STEPS}</Text>
                    <Text className="text-sm font-medium text-primary-600">
                        {Math.round((currentStep / TOTAL_STEPS) * 100)}%
                    </Text>
                </View>
                <View className="h-2 bg-secondary-100 rounded-full">
                    <View
                        className="h-2 bg-primary-600 rounded-full"
                        style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="py-4">
                    {renderStep()}
                </View>
            </ScrollView>

            {/* Navigation buttons */}
            <View className="px-6 py-4 border-t border-secondary-100">
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <CustomButton
                            title={currentStep === 1 ? "Back" : "Previous"}
                            onPress={currentStep === 1 ? handleBack : handlePrevious}
                            variant="outline"
                            size="md"
                            icon="←"
                        />
                    </View>
                    <View className="flex-1">
                        {currentStep < TOTAL_STEPS ? (
                            <CustomButton
                                title="Next"
                                onPress={handleNext}
                                variant="primary"
                                size="md"
                            />
                        ) : (
                            <CustomButton
                                title="Submit"
                                onPress={handleSubmit}
                                loading={loading}
                                variant="primary"
                                size="md"
                            />
                        )}
                    </View>
                </View>
            </View>

            {/* Custom Alert */}
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

export default ProfessionalSignupScreen;

