import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/axios';
import Router from '../config/Router';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Quick check - don't block on AsyncStorage
            // This allows app to show auth screens immediately
            const checkPromise = (async () => {
                try {
                    const token = await AsyncStorage.getItem('authToken');
                    const userData = await AsyncStorage.getItem('userData');

                    if (token && userData) {
                        try {
                            const parsedUser = JSON.parse(userData);
                            setUser(parsedUser);
                            setIsAuthenticated(true);
                        } catch (parseError) {
                            console.error('Error parsing user data:', parseError);
                            // Clear invalid data
                            await AsyncStorage.removeItem('authToken');
                            await AsyncStorage.removeItem('userData');
                        }
                    }
                } catch (storageError) {
                    console.error('Error reading storage:', storageError);
                    // Continue without blocking
                }
            })();

            // Add timeout to prevent hanging (reduced to 2 seconds for faster startup)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Auth check timeout')), 2000)
            );

            await Promise.race([checkPromise, timeoutPromise]);
        } catch (error) {
            // Silently handle timeout/errors - just show auth screen
            console.log('Auth check completed (showing auth screens)');
        } finally {
            // Always set loading to false quickly
            setLoading(false);
        }
    };

    // Login function matching backend API
    const login = async (email, password, role) => {
        try {
            setLoading(true);

            const response = await api.post(Router.AUTH.USER_LOGIN, {
                email,
                password,
                role: role || 'user', // Default to 'user' if not provided
            });

            if (response.data.success && response.data.data) {
                const { token, id, role: userRole, email: userEmail, name } = response.data.data;

                const userData = {
                    id,
                    email: userEmail,
                    name,
                    role: userRole,
                };

                await AsyncStorage.setItem('authToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: userData,
                    message: response.data.message,
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Login failed',
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors ||
                error.message ||
                'Login failed. Please try again.';
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    // Signup function matching backend API
    const signup = async (userData) => {
        try {
            setLoading(true);

            const response = await api.post(Router.AUTH.USER_REGISTER, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                mobileNumber: userData.mobileNumber,
                role: userData.role || 'user',
            });

            if (response.data.success && response.data.data) {
                return {
                    success: true,
                    data: response.data.data, // Contains email, role, emailVerificationId
                    message: response.data.message,
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Registration failed',
                };
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors ||
                error.message ||
                'Registration failed. Please try again.';
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP function matching backend API
    const verifyOtp = async (emailVerificationId, otp, role) => {
        try {
            setLoading(true);

            const response = await api.post(Router.AUTH.VERIFY_OTP, {
                emailVerificationId,
                otp,
                role,
            });

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'OTP verification failed',
                };
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'OTP verification failed. Please try again.';
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP function matching backend API
    const resendOtp = async (emailVerificationId, role) => {
        try {
            setLoading(true);

            const response = await api.post(Router.AUTH.RESEND_OTP, {
                emailVerificationId,
                role,
            });

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    data: response.data.data,
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Failed to resend OTP',
                };
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Failed to resend OTP. Please try again.';
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (userData) => {
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Update user error:', error);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

