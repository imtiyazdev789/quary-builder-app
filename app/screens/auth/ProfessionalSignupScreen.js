import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    CustomAlert,
    CustomButton,
    InputField,
    DropdownSelector,
    DocumentPickerField,
    DatePickerField,
    LocationPickerField,
    ErrorText,
} from '../../components';
import api from '../../config/axios';
import useProfessionalSignupStore from '../../store/useProfessionalSignupStore';

const TOTAL_STEPS = 7;

// Dropdown options
const BUSINESS_TYPES = [
    { key: 'Individual', label: 'Individual' },
    { key: 'Partnership/LLP', label: 'Partnership / LLP' },
    { key: 'PrivateLimited/Company', label: 'Private Limited / Company' },
];

const CATEGORIES = [
    { key: 'ArchitectureConsultant', label: 'Architecture Consultant' },
    { key: 'InteriorDesigner', label: 'Interior Designer' },
    { key: 'StructuralConsultant', label: 'Structural Consultant' },
    { key: 'MEPConsultant', label: 'MEP Consultant' },
    { key: 'Contractor', label: 'Contractor' },
];

const DESIGNATIONS = [
    { key: 'Founder', label: 'Founder' },
    { key: 'Partner', label: 'Partner' },
    { key: 'Director', label: 'Director' },
    { key: 'Manager', label: 'Manager' },
];

const KYC_TYPES = [
    { key: 'Aadhaar', label: 'Aadhaar Card' },
    { key: 'PAN', label: 'PAN Card' },
    { key: 'VoterID', label: 'Voter ID' },
    { key: 'Passport', label: 'Passport' },
];

const SERVICES_LIST = [
    'Architectural Design',
    'Interior Design',
    'Structural Design',
    'MEP Design',
    'Project Management',
    'Construction',
    'Renovation',
    '3D Visualization',
    'Vastu Consultation',
    'Landscape Design',
];

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
            formData.append('registeredAddress[line1]', addressLine1);
            formData.append('registeredAddress[line2]', addressLine2);
            formData.append('formattedAddress', `${addressLine1}, ${addressLine2}, ${city}, ${district}, ${state} - ${pincode}`);
            if (coordinates) {
                formData.append('location[type]', 'Point');
                formData.append('location[coordinates][0]', coordinates.longitude.toString());
                formData.append('location[coordinates][1]', coordinates.latitude.toString());
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
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">Business Information</Text>

                        <InputField
                            label="Business Name *"
                            value={businessName}
                            onChangeText={(text) => { setBusinessName(text); clearError('businessName'); }}
                            error={errors.businessName}
                            placeholder="Enter business name"
                            maxLength={140}
                        />

                        <DropdownSelector
                            label="Business Type *"
                            options={BUSINESS_TYPES}
                            selected={businessType}
                            onSelect={(val) => { setBusinessType(val); clearError('businessType'); }}
                            error={errors.businessType}
                        />

                        <DropdownSelector
                            label="Category *"
                            options={CATEGORIES}
                            selected={category}
                            onSelect={(val) => { setCategory(val); clearError('category'); }}
                            error={errors.category}
                        />

                        <DatePickerField
                            label="Date of Establishment *"
                            value={dateOfEstablishment}
                            onChange={(date) => { setDateOfEstablishment(date); clearError('dateOfEstablishment'); }}
                            error={errors.dateOfEstablishment}
                            placeholder="Select establishment date"
                            maximumDate={new Date()}
                            required
                        />
                    </View>
                );

            case 2:
                return (
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">Location Details</Text>

                        {/* Location Picker */}
                        <LocationPickerField
                            onLocationSelect={(locationData) => {
                                setCoordinates(locationData.coordinates);
                                if (locationData.addressLine1) setAddressLine1(locationData.addressLine1);
                                if (locationData.addressLine2) setAddressLine2(locationData.addressLine2);
                                if (locationData.city) setCity(locationData.city);
                                if (locationData.district) setDistrict(locationData.district);
                                if (locationData.state) setState(locationData.state);
                                if (locationData.pincode) setPincode(locationData.pincode);
                            }}
                        />

                        <InputField
                            label="Address Line 1"
                            value={addressLine1}
                            onChangeText={setAddressLine1}
                            placeholder="Building, Street"
                        />

                        <InputField
                            label="Address Line 2"
                            value={addressLine2}
                            onChangeText={setAddressLine2}
                            placeholder="Area, Landmark"
                        />

                        <InputField
                            label="City *"
                            value={city}
                            onChangeText={(text) => { setCity(text); clearError('city'); }}
                            error={errors.city}
                            placeholder="Enter city"
                        />

                        <InputField
                            label="District *"
                            value={district}
                            onChangeText={(text) => { setDistrict(text); clearError('district'); }}
                            error={errors.district}
                            placeholder="Enter district"
                        />

                        <InputField
                            label="State *"
                            value={state}
                            onChangeText={(text) => { setState(text); clearError('state'); }}
                            error={errors.state}
                            placeholder="Enter state"
                        />

                        <InputField
                            label="Pincode *"
                            value={pincode}
                            onChangeText={(text) => { setPincode(text.replace(/[^0-9]/g, '').slice(0, 6)); clearError('pincode'); }}
                            error={errors.pincode}
                            placeholder="Enter 6-digit pincode"
                            keyboardType="number-pad"
                            maxLength={6}
                        />

                        {coordinates && (
                            <View className="bg-success-50 rounded-xl p-3 mt-2">
                                <Text className="text-success-700 text-xs">
                                    📍 Location: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                                </Text>
                            </View>
                        )}
                    </View>
                );

            case 3:
                return (
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">Company Contact</Text>

                        <InputField
                            label="Company Email *"
                            value={companyEmail}
                            onChangeText={(text) => { setCompanyEmail(text); clearError('companyEmail'); }}
                            error={errors.companyEmail}
                            placeholder="company@example.com"
                            keyboardType="email-address"
                        />

                        <InputField
                            label="Company Phone *"
                            value={companyPhone}
                            onChangeText={(text) => { setCompanyPhone(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('companyPhone'); }}
                            error={errors.companyPhone}
                            placeholder="10-digit phone number"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        <InputField
                            label="WhatsApp Number"
                            value={whatsappNumber}
                            onChangeText={(text) => setWhatsappNumber(text.replace(/[^0-9]/g, '').slice(0, 10))}
                            placeholder="10-digit WhatsApp number"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        <InputField
                            label="Website URL"
                            value={websiteUrl}
                            onChangeText={setWebsiteUrl}
                            placeholder="https://www.example.com"
                            keyboardType="url"
                        />
                    </View>
                );

            case 4:
                return (
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">Representative Details</Text>

                        <InputField
                            label="Representative Name *"
                            value={representativeName}
                            onChangeText={(text) => { setRepresentativeName(text); clearError('representativeName'); }}
                            error={errors.representativeName}
                            placeholder="Full name"
                            maxLength={120}
                        />

                        <DropdownSelector
                            label="Designation *"
                            options={DESIGNATIONS}
                            selected={designation}
                            onSelect={(val) => { setDesignation(val); clearError('designation'); }}
                            error={errors.designation}
                        />

                        <InputField
                            label="Representative Mobile *"
                            value={representativeMobile}
                            onChangeText={(text) => { setRepresentativeMobile(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('representativeMobile'); }}
                            error={errors.representativeMobile}
                            placeholder="10-digit mobile number"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        <InputField
                            label="Representative Email *"
                            value={representativeEmail}
                            onChangeText={(text) => { setRepresentativeEmail(text); clearError('representativeEmail'); }}
                            error={errors.representativeEmail}
                            placeholder="email@example.com"
                            keyboardType="email-address"
                        />
                    </View>
                );

            case 5:
                return (
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">KYC & Documents</Text>

                        <DropdownSelector
                            label="KYC Document Type *"
                            options={KYC_TYPES}
                            selected={kycIdType}
                            onSelect={(val) => { setKycIdType(val); clearError('kycIdType'); }}
                            error={errors.kycIdType}
                        />

                        <DocumentPickerField
                            label="KYC Document"
                            document={kycIdDocument}
                            onSelect={(doc) => { setKycIdDocument(doc); clearError('kycIdDocument'); }}
                            error={errors.kycIdDocument}
                            required
                        />

                        <DocumentPickerField
                            label="Company Logo"
                            document={logo}
                            onSelect={(doc) => { setLogo(doc); clearError('logo'); }}
                            error={errors.logo}
                            required
                            accept="image"
                            showPreview
                            placeholder="Tap to upload logo"
                        />

                        {/* Conditional documents */}
                        {(businessType === 'Partnership/LLP' || businessType === 'PrivateLimited/Company') && (
                            <DocumentPickerField
                                label="Company Registration Document"
                                document={companyRegistrationDoc}
                                onSelect={(doc) => { setCompanyRegistrationDoc(doc); clearError('companyRegistrationDoc'); }}
                                error={errors.companyRegistrationDoc}
                                required
                            />
                        )}

                        {category === 'ArchitectureConsultant' && (
                            <DocumentPickerField
                                label="COA Registration Document"
                                document={coaRegistrationDoc}
                                onSelect={(doc) => { setCoaRegistrationDoc(doc); clearError('coaRegistrationDoc'); }}
                                error={errors.coaRegistrationDoc}
                                required
                            />
                        )}

                        {category === 'StructuralConsultant' && (
                            <DocumentPickerField
                                label="Structural Registration Document"
                                document={structuralRegistrationDoc}
                                onSelect={(doc) => { setStructuralRegistrationDoc(doc); clearError('structuralRegistrationDoc'); }}
                                error={errors.structuralRegistrationDoc}
                                required
                            />
                        )}

                        {category === 'Contractor' && (
                            <DocumentPickerField
                                label="Construction License"
                                document={constructionLicenseDoc}
                                onSelect={(doc) => { setConstructionLicenseDoc(doc); clearError('constructionLicenseDoc'); }}
                                error={errors.constructionLicenseDoc}
                                required
                            />
                        )}

                        <InputField
                            label="GST Number"
                            value={gstNumber}
                            onChangeText={setGstNumber}
                            placeholder="Enter GST number (optional)"
                            maxLength={20}
                        />

                        <DocumentPickerField
                            label="GST Document"
                            document={gstDocument}
                            onSelect={setGstDocument}
                        />
                    </View>
                );

            case 6:
                return (
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">About Your Business</Text>

                        <InputField
                            label="Tagline"
                            value={tagline}
                            onChangeText={setTagline}
                            placeholder="Your company tagline"
                            maxLength={160}
                        />

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">
                                Short Description * <Text className="text-secondary-400 text-xs">(25-150 words)</Text>
                            </Text>
                            <TextInput
                                className={`border rounded-xl px-4 py-3 text-base bg-white h-32 ${errors.shortDescription ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Brief overview of your business (25-150 words)"
                                placeholderTextColor="#94a3b8"
                                value={shortDescription}
                                onChangeText={(text) => {
                                    setShortDescription(text);
                                    clearError('shortDescription');
                                }}
                                multiline
                                numberOfLines={5}
                                style={{ textAlignVertical: 'top' }}
                            />
                            <Text className="text-xs text-secondary-400 mt-1 ml-1">
                                {shortDescription.trim().split(/\s+/).filter(Boolean).length} words
                            </Text>
                            <ErrorText error={errors.shortDescription} />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">
                                Detailed Description *
                            </Text>
                            <TextInput
                                className={`border rounded-xl px-4 py-3 text-base bg-white h-40 ${errors.detailedDescription ? 'border-error-500' : 'border-secondary-200'
                                    }`}
                                placeholder="Detailed information about your services, experience, and expertise"
                                placeholderTextColor="#94a3b8"
                                value={detailedDescription}
                                onChangeText={(text) => {
                                    setDetailedDescription(text);
                                    clearError('detailedDescription');
                                }}
                                multiline
                                numberOfLines={8}
                                style={{ textAlignVertical: 'top' }}
                            />
                            <ErrorText error={errors.detailedDescription} />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">
                                Services Offered * <Text className="text-secondary-400 text-xs">(Select all that apply)</Text>
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {SERVICES_LIST.map((service) => (
                                    <TouchableOpacity
                                        key={service}
                                        className={`py-2 px-3 rounded-lg border ${selectedServices.includes(service)
                                            ? 'bg-primary-600 border-primary-600'
                                            : 'bg-white border-secondary-200'
                                            }`}
                                        onPress={() => {
                                            toggleService(service);
                                            clearError('services');
                                        }}
                                    >
                                        <Text className={`text-xs ${selectedServices.includes(service) ? 'text-white' : 'text-secondary-700'
                                            }`}>
                                            {service}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <ErrorText error={errors.services} />
                        </View>
                    </View>
                );

            case 7:
                return (
                    <View>
                        <Text className="text-xl font-bold text-secondary-900 mb-4">Create Password</Text>

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">Password *</Text>
                            <View className="relative">
                                <TextInput
                                    className={`border rounded-xl px-4 py-3 pr-12 text-base bg-white ${errors.password ? 'border-error-500' : 'border-secondary-200'
                                        }`}
                                    placeholder="Enter password (min 6 characters)"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        clearError('password');
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    className="absolute right-3 top-3"
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text className="text-xl text-secondary-500">
                                        {showPassword ? '🙈' : '👁️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ErrorText error={errors.password} />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-secondary-800 mb-2">Confirm Password *</Text>
                            <View className="relative">
                                <TextInput
                                    className={`border rounded-xl px-4 py-3 pr-12 text-base bg-white ${errors.confirmPassword ? 'border-error-500' : 'border-secondary-200'
                                        }`}
                                    placeholder="Confirm password"
                                    placeholderTextColor="#94a3b8"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        clearError('confirmPassword');
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    className="absolute right-3 top-3"
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Text className="text-xl text-secondary-500">
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ErrorText error={errors.confirmPassword} />
                        </View>

                        <TouchableOpacity
                            className="flex-row items-start mb-6"
                            onPress={() => {
                                setDeclarationAccepted(!declarationAccepted);
                                clearError('declaration');
                            }}
                        >
                            <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${declarationAccepted ? 'bg-primary-600 border-primary-600' : 'border-secondary-300'
                                }`}>
                                {declarationAccepted && <Text className="text-white text-sm">✓</Text>}
                            </View>
                            <Text className="flex-1 text-sm text-secondary-600">
                                I hereby declare that all information provided is true and accurate to the best of my knowledge.
                                I agree to the Terms of Service and Privacy Policy.
                            </Text>
                        </TouchableOpacity>
                        <ErrorText error={errors.declaration} />

                        <View className="bg-primary-50 rounded-xl p-4 mb-4">
                            <Text className="text-sm text-primary-800 font-medium mb-2">📋 What happens next?</Text>
                            <Text className="text-xs text-primary-700">
                                • You'll receive an OTP on your email for verification{'\n'}
                                • Our team will review your documents{'\n'}
                                • Once approved, you can start receiving project requests
                            </Text>
                        </View>
                    </View>
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

