/**
 * API Router Configuration
 * 
 * This file contains all backend API endpoints organized by feature.
 * Use these constants throughout the app instead of hardcoding URLs.
 * 
 * Usage:
 * import Router from '../config/Router';
 * api.post(Router.AUTH.REGISTER, data);
 */

const Router = {
    // ============================================
    // AUTHENTICATION ROUTES
    // ============================================
    AUTH: {
        // User Authentication
        USER_REGISTER: '/userauth/user/register',
        USER_LOGIN: '/userauth/user/login',

        // OTP Verification
        VERIFY_OTP: '/auth/verifiyotp',
        RESEND_OTP: '/auth/resendotp',
        OTP_STATUS: '/auth/otpstatus',

        // Professional Registration
        PROFESSIONAL_REGISTER: '/auth/professional/newregister',

        // Password Management
        FORGET_PASSWORD_OTP: '/auth/forget-password/otp-verification',
        FORGET_PASSWORD_VERIFY_OTP: '/auth/forget-password/verify-otp',
        FORGET_PASSWORD: '/auth/forget-password',
        FORGET_PASSWORD_RESEND_OTP: '/auth/forget-password/resend-otp',
    },

    // ============================================
    // ADMIN ROUTES
    // ============================================
    ADMIN: {
        LOGIN: '/admin/login',
        DASHBOARD_DETAILS: '/admin/dashboarddetails',
    },

    // ============================================
    // USER ROUTES
    // ============================================
    USER: {
        // Profile
        GET_PROFILE: '/user/profile',
        UPDATE_PROFILE: '/api/user/updateprofile',

        // Dashboard
        GET_DASHBOARD_DETAILS: '/user/getuserdashboarddetail',
    },

    // ============================================
    // PROFESSIONAL ROUTES
    // ============================================
    PROFESSIONAL: {
        // Profile
        GET_PROFILE_DETAILS: (id) => `/api/professionaldetails/${id}`,
        GET_MY_PROFILE: '/api/professionaldetails',
        UPDATE_PROFILE: '/api/updateprofprofile',

        // Dashboard
        GET_DASHBOARD_INFO: '/professional/dashboard/info',

        // Portfolio
        CREATE_PORTFOLIO: '/portfolio/createportfolio',
        FETCH_PORTFOLIOS: '/portfolio/fetchportfolios',

        // Projects
        CREATE_PROJECT: '/profes/createproject',
        FETCH_PROJECTS: '/profes/fetchprojects',
        FETCH_PROJECT_DETAILS: (id) => `/profes/fetchprojectdetails/${id}`,
        FETCH_UNPUBLISHED_PROJECTS: '/profes/fetch-unpublished-project',
        DELETE_PROJECT: (id) => `/profes/deleteproject/${id}`,

        // Account
        DELETE_ACCOUNT: '/api/delete',

        // List
        GET_PROFESSIONAL_LIST: '/professional/list',
    },

    // ============================================
    // CLIENT REQUEST ROUTES
    // ============================================
    REQUEST: {
        // Create Request
        CREATE_REQUEST: '/request/client',

        // List Requests (Professional)
        GET_REQUESTS_LIST: '/request/list',

        // Update Request Status (Professional)
        UPDATE_REQUEST_STATUS: (id) => `/request/updatestatus/${id}`,

        // Client Requests (Client)
        GET_CLIENT_REQUESTS: '/request/clientrequests',
    },

    // ============================================
    // REVIEW ROUTES
    // ============================================
    REVIEW: {
        CREATE_REVIEW: '/api/createreview',
        GET_PROFESSIONAL_REVIEWS: '/api/getprofessionalreviews',
    },

    // ============================================
    // UPLOAD ROUTES
    // ============================================
    UPLOAD: {
        UPLOADS: '/uploads',
        API_UPLOADS: '/api/uploads',
    },
};

export default Router;

