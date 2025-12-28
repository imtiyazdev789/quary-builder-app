import React from 'react';
import { View, Text } from 'react-native';
import { DropdownSelector, DocumentPickerField, InputField } from '../../../components';
import { KYC_TYPES } from './constants';

const Step5KycDocuments = ({
    businessType,
    category,
    kycIdType,
    setKycIdType,
    kycIdDocument,
    setKycIdDocument,
    logo,
    setLogo,
    companyRegistrationDoc,
    setCompanyRegistrationDoc,
    coaRegistrationDoc,
    setCoaRegistrationDoc,
    structuralRegistrationDoc,
    setStructuralRegistrationDoc,
    constructionLicenseDoc,
    setConstructionLicenseDoc,
    gstDocument,
    setGstDocument,
    gstNumber,
    setGstNumber,
    errors,
    clearError,
}) => {
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

            {/* Company Registration Document - Required for Partnership/LLP or Company */}
            {(businessType === 'Partnership/LLP' || businessType === 'PrivateLimited/Company') && (
                <DocumentPickerField
                    label="Company Registration Document *"
                    document={companyRegistrationDoc}
                    onSelect={(doc) => { setCompanyRegistrationDoc(doc); clearError('companyRegistrationDoc'); }}
                    error={errors.companyRegistrationDoc}
                    required
                />
            )}

            {/* Category-specific documents - Only show the document required for selected category */}
            {category === 'ArchitectureConsultant' && (
                <DocumentPickerField
                    label="COA Registration Document *"
                    document={coaRegistrationDoc}
                    onSelect={(doc) => { setCoaRegistrationDoc(doc); clearError('coaRegistrationDoc'); }}
                    error={errors.coaRegistrationDoc}
                    required
                />
            )}

            {category === 'StructuralConsultant' && (
                <DocumentPickerField
                    label="Structural Registration Document *"
                    document={structuralRegistrationDoc}
                    onSelect={(doc) => { setStructuralRegistrationDoc(doc); clearError('structuralRegistrationDoc'); }}
                    error={errors.structuralRegistrationDoc}
                    required
                />
            )}

            {category === 'Contractor' && (
                <DocumentPickerField
                    label="Construction License *"
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
};

export default Step5KycDocuments;

