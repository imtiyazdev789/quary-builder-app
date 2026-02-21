// Constants for Request Creation Wizard

export const TOTAL_STEPS = 4; // Simplified to 4 steps initially

// Project Types
export const PROJECT_TYPES = [
    { key: 'Residential', label: 'Residential' },
    { key: 'Commercial', label: 'Commercial' },
    { key: 'Industrial', label: 'Industrial' },
    { key: 'Mixed-Use', label: 'Mixed Use' },
    { key: 'Institutional', label: 'Institutional' },
    { key: 'Hospitality', label: 'Hospitality' },
];

// Project Categories (matching professional categories)
export const PROJECT_CATEGORIES = [
    { key: 'ArchitectureConsultant', label: 'Architecture' },
    { key: 'InteriorDesigner', label: 'Interior Design' },
    { key: 'StructuralConsultant', label: 'Structural Engineering' },
    { key: 'MEPConsultant', label: 'MEP (Mechanical, Electrical, Plumbing)' },
    { key: 'Contractor', label: 'Construction/Contractor' },
];

// Service Types (matching professional services)
export const SERVICE_TYPES = [
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

// Budget Ranges
export const BUDGET_RANGES = [
    { key: 'Under 1L', label: 'Under ₹1 Lakh' },
    { key: '1L-5L', label: '₹1 Lakh - ₹5 Lakhs' },
    { key: '5L-10L', label: '₹5 Lakhs - ₹10 Lakhs' },
    { key: '10L-25L', label: '₹10 Lakhs - ₹25 Lakhs' },
    { key: '25L-50L', label: '₹25 Lakhs - ₹50 Lakhs' },
    { key: '50L-1Cr', label: '₹50 Lakhs - ₹1 Crore' },
    { key: '1Cr-5Cr', label: '₹1 Crore - ₹5 Crores' },
    { key: '5Cr+', label: 'Above ₹5 Crores' },
];

// Timeline Options
export const TIMELINE_OPTIONS = [
    { key: 'Immediate', label: 'Immediate (Within 1 month)' },
    { key: '1-3 months', label: '1-3 months' },
    { key: '3-6 months', label: '3-6 months' },
    { key: '6-12 months', label: '6-12 months' },
    { key: '12+ months', label: '12+ months' },
];
