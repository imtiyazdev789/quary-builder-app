import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Professional Signup Store
 * Persists form data across app sessions so users can resume where they left off
 */
const useProfessionalSignupStore = create(
    persist(
        (set, get) => ({
            // Current step (1-7)
            currentStep: 1,

            // Step 1: Business Info
            businessName: '',
            businessType: '',
            category: '',
            dateOfEstablishment: '',

            // Step 2: Location
            coordinates: null,
            addressLine1: '',
            addressLine2: '',
            city: '',
            district: '',
            state: '',
            pincode: '',

            // Step 3: Company Contact
            companyEmail: '',
            companyPhone: '',
            whatsappNumber: '',
            websiteUrl: '',

            // Step 4: Representative
            representativeName: '',
            designation: '',
            representativeMobile: '',
            representativeEmail: '',

            // Step 5: KYC & Documents (documents stored as metadata only, not full file)
            kycIdType: '',
            kycIdDocument: null,
            logo: null,
            companyRegistrationDoc: null,
            coaRegistrationDoc: null,
            structuralRegistrationDoc: null,
            constructionLicenseDoc: null,
            gstDocument: null,
            gstNumber: '',

            // Step 6: About Business
            shortDescription: '',
            detailedDescription: '',
            selectedServices: [],
            tagline: '',

            // Step 7: Password & Declaration (not persisted for security)
            // password and confirmPassword handled locally

            // Actions
            setCurrentStep: (step) => set({ currentStep: step }),

            // Update field value
            updateField: (field, value) => set({ [field]: value }),

            // Update multiple fields at once
            updateFields: (fields) => set(fields),

            // Update Step 1 data
            updateStep1: (data) => set({
                businessName: data.businessName ?? get().businessName,
                businessType: data.businessType ?? get().businessType,
                category: data.category ?? get().category,
                dateOfEstablishment: data.dateOfEstablishment ?? get().dateOfEstablishment,
            }),

            // Update Step 2 data
            updateStep2: (data) => set({
                coordinates: data.coordinates ?? get().coordinates,
                addressLine1: data.addressLine1 ?? get().addressLine1,
                addressLine2: data.addressLine2 ?? get().addressLine2,
                city: data.city ?? get().city,
                district: data.district ?? get().district,
                state: data.state ?? get().state,
                pincode: data.pincode ?? get().pincode,
            }),

            // Update Step 3 data
            updateStep3: (data) => set({
                companyEmail: data.companyEmail ?? get().companyEmail,
                companyPhone: data.companyPhone ?? get().companyPhone,
                whatsappNumber: data.whatsappNumber ?? get().whatsappNumber,
                websiteUrl: data.websiteUrl ?? get().websiteUrl,
            }),

            // Update Step 4 data
            updateStep4: (data) => set({
                representativeName: data.representativeName ?? get().representativeName,
                designation: data.designation ?? get().designation,
                representativeMobile: data.representativeMobile ?? get().representativeMobile,
                representativeEmail: data.representativeEmail ?? get().representativeEmail,
            }),

            // Update Step 5 data
            updateStep5: (data) => set({
                kycIdType: data.kycIdType ?? get().kycIdType,
                kycIdDocument: data.kycIdDocument ?? get().kycIdDocument,
                logo: data.logo ?? get().logo,
                companyRegistrationDoc: data.companyRegistrationDoc ?? get().companyRegistrationDoc,
                coaRegistrationDoc: data.coaRegistrationDoc ?? get().coaRegistrationDoc,
                structuralRegistrationDoc: data.structuralRegistrationDoc ?? get().structuralRegistrationDoc,
                constructionLicenseDoc: data.constructionLicenseDoc ?? get().constructionLicenseDoc,
                gstDocument: data.gstDocument ?? get().gstDocument,
                gstNumber: data.gstNumber ?? get().gstNumber,
            }),

            // Update Step 6 data
            updateStep6: (data) => set({
                shortDescription: data.shortDescription ?? get().shortDescription,
                detailedDescription: data.detailedDescription ?? get().detailedDescription,
                selectedServices: data.selectedServices ?? get().selectedServices,
                tagline: data.tagline ?? get().tagline,
            }),

            // Get all form data for submission
            getFormData: () => {
                const state = get();
                return {
                    // Step 1
                    businessName: state.businessName,
                    businessType: state.businessType,
                    category: state.category,
                    dateOfEstablishment: state.dateOfEstablishment,
                    // Step 2
                    coordinates: state.coordinates,
                    addressLine1: state.addressLine1,
                    addressLine2: state.addressLine2,
                    city: state.city,
                    district: state.district,
                    state: state.state,
                    pincode: state.pincode,
                    // Step 3
                    companyEmail: state.companyEmail,
                    companyPhone: state.companyPhone,
                    whatsappNumber: state.whatsappNumber,
                    websiteUrl: state.websiteUrl,
                    // Step 4
                    representativeName: state.representativeName,
                    designation: state.designation,
                    representativeMobile: state.representativeMobile,
                    representativeEmail: state.representativeEmail,
                    // Step 5
                    kycIdType: state.kycIdType,
                    kycIdDocument: state.kycIdDocument,
                    logo: state.logo,
                    companyRegistrationDoc: state.companyRegistrationDoc,
                    coaRegistrationDoc: state.coaRegistrationDoc,
                    structuralRegistrationDoc: state.structuralRegistrationDoc,
                    constructionLicenseDoc: state.constructionLicenseDoc,
                    gstDocument: state.gstDocument,
                    gstNumber: state.gstNumber,
                    // Step 6
                    shortDescription: state.shortDescription,
                    detailedDescription: state.detailedDescription,
                    selectedServices: state.selectedServices,
                    tagline: state.tagline,
                };
            },

            // Check if there's saved progress
            hasSavedProgress: () => {
                const state = get();
                return state.currentStep > 1 ||
                    state.businessName !== '' ||
                    state.companyEmail !== '';
            },

            // Reset all form data (after successful submission)
            resetForm: () => set({
                currentStep: 1,
                businessName: '',
                businessType: '',
                category: '',
                dateOfEstablishment: '',
                coordinates: null,
                addressLine1: '',
                addressLine2: '',
                city: '',
                district: '',
                state: '',
                pincode: '',
                companyEmail: '',
                companyPhone: '',
                whatsappNumber: '',
                websiteUrl: '',
                representativeName: '',
                designation: '',
                representativeMobile: '',
                representativeEmail: '',
                kycIdType: '',
                kycIdDocument: null,
                logo: null,
                companyRegistrationDoc: null,
                coaRegistrationDoc: null,
                structuralRegistrationDoc: null,
                constructionLicenseDoc: null,
                gstDocument: null,
                gstNumber: '',
                shortDescription: '',
                detailedDescription: '',
                selectedServices: [],
                tagline: '',
            }),
        }),
        {
            name: 'professional-signup-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist these fields (exclude sensitive data)
            partialize: (state) => ({
                currentStep: state.currentStep,
                businessName: state.businessName,
                businessType: state.businessType,
                category: state.category,
                dateOfEstablishment: state.dateOfEstablishment,
                coordinates: state.coordinates,
                addressLine1: state.addressLine1,
                addressLine2: state.addressLine2,
                city: state.city,
                district: state.district,
                state: state.state,
                pincode: state.pincode,
                companyEmail: state.companyEmail,
                companyPhone: state.companyPhone,
                whatsappNumber: state.whatsappNumber,
                websiteUrl: state.websiteUrl,
                representativeName: state.representativeName,
                designation: state.designation,
                representativeMobile: state.representativeMobile,
                representativeEmail: state.representativeEmail,
                kycIdType: state.kycIdType,
                gstNumber: state.gstNumber,
                shortDescription: state.shortDescription,
                detailedDescription: state.detailedDescription,
                selectedServices: state.selectedServices,
                tagline: state.tagline,
                // Note: Documents (files) are NOT persisted as they contain file URIs
                // that may become invalid after app restart
            }),
        }
    )
);

export default useProfessionalSignupStore;

