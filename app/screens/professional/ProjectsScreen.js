import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert } from '../../components';

const ProjectsScreen = () => {
    const navigation = useNavigation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchProjects();
        }, [])
    );

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.PROFESSIONAL.FETCH_PROJECTS);

            if (response.data.success) {
                const projectsData = response.data.data || [];
                // Sort by createdAt (newest first)
                const sortedProjects = projectsData.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });
                setProjects(sortedProjects);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load projects. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            setProjects([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProjects();
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getProjectTitle = (project) => {
        return project?.projectBasicDetail?.projectTitle || 'Untitled Project';
    };

    const getProjectCategory = (project) => {
        return project?.projectBasicDetail?.projectCategory || 'N/A';
    };

    const getProjectLocation = (project) => {
        const city = project?.projectBasicDetail?.projectCity || '';
        const state = project?.projectBasicDetail?.projectState || '';
        if (city && state) {
            return `${city}, ${state}`;
        }
        return city || state || 'Location not specified';
    };

    const getProjectStatus = (project) => {
        // API only returns published projects, but we check for safety
        if (project?.isPublished) {
            return { label: 'Published', color: 'bg-green-100 text-green-800' };
        }
        if (project?.isDraft) {
            return { label: 'Draft', color: 'bg-yellow-100 text-yellow-800' };
        }
        return { label: 'Unpublished', color: 'bg-gray-100 text-gray-800' };
    };

    const getProjectImage = (project) => {
        const images = project?.projectImage || [];
        if (images.length > 0) {
            // Handle both URL strings and objects
            let firstImage = images[0];
            let imageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url || firstImage.uri || '';

            // Fix localhost for Android
            if (imageUrl && Platform.OS === 'android') {
                const base = process.env.EXPO_PUBLIC_API_BASE_URL || '';
                if (base.includes('localhost')) {
                    imageUrl = imageUrl.replace('localhost', '10.0.2.2');
                } else if (imageUrl.includes('localhost')) {
                    imageUrl = imageUrl.replace('localhost', '10.0.2.2');
                }
            }

            // Ensure URL is complete (add base URL if it's a relative path)
            if (imageUrl && !imageUrl.startsWith('http')) {
                const base = process.env.EXPO_PUBLIC_API_BASE_URL || '';
                const normalizedBase = base.includes('localhost') && Platform.OS === 'android'
                    ? base.replace('localhost', '10.0.2.2')
                    : base;
                imageUrl = `${normalizedBase}${imageUrl.replace(/^\//, '')}`;
            }

            return imageUrl;
        }
        return null;
    };

    const handleDeleteProject = (projectId) => {
        showAlert({
            title: 'Delete Project',
            message: 'Are you sure you want to delete this project? This action cannot be undone.',
            icon: '⚠️',
            buttons: [
                {
                    text: 'Cancel',
                    onPress: hideAlert,
                    style: 'secondary',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        hideAlert();
                        await deleteProject(projectId);
                    },
                    style: 'danger',
                },
            ],
        });
    };

    const deleteProject = async (projectId) => {
        try {
            setLoading(true);
            const response = await api.delete(Router.PROFESSIONAL.DELETE_PROJECT(projectId));

            if (response.data.success) {
                showAlert({
                    title: 'Success',
                    message: 'Project deleted successfully',
                    icon: '✅',
                    buttons: [{ text: 'OK', onPress: () => { hideAlert(); fetchProjects(); }, style: 'primary' }],
                });
            } else {
                throw new Error(response.data.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            let errorMessage = 'Failed to delete project. Please try again.';
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

    if (loading && !refreshing) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading projects...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="px-4 py-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-3xl font-bold text-gray-900">
                            My Projects
                        </Text>
                        <TouchableOpacity
                            className="bg-primary-600 rounded-lg px-4 py-2"
                            onPress={() => {
                                // TODO: Navigate to create project screen
                                showAlert({
                                    title: 'Coming Soon',
                                    message: 'Project creation feature will be available soon.',
                                    icon: '🚧',
                                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                                });
                            }}
                        >
                            <Text className="text-white font-semibold">+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    {projects.length === 0 ? (
                        <View className="bg-white rounded-lg p-8 items-center">
                            <Text className="text-6xl mb-4">📁</Text>
                            <Text className="text-xl font-semibold text-gray-900 mb-2">
                                No Projects Yet
                            </Text>
                            <Text className="text-base text-gray-600 text-center mb-6">
                                Start showcasing your work by adding your first project
                            </Text>
                            <TouchableOpacity
                                className="bg-primary-600 rounded-lg px-6 py-3"
                                onPress={() => {
                                    // TODO: Navigate to create project screen
                                    showAlert({
                                        title: 'Coming Soon',
                                        message: 'Project creation feature will be available soon.',
                                        icon: '🚧',
                                        buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                                    });
                                }}
                            >
                                <Text className="text-white font-semibold">Create Your First Project</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        projects.map((project) => {
                            const status = getProjectStatus(project);
                            const projectImage = getProjectImage(project);

                            return (
                                <View
                                    key={project.id || project._id}
                                    className="bg-white rounded-lg mb-4 shadow-sm overflow-hidden"
                                >
                                    {/* Project Image */}
                                    {projectImage && (
                                        <Image
                                            source={{ uri: projectImage }}
                                            className="w-full h-48"
                                            resizeMode="cover"
                                        />
                                    )}

                                    <View className="p-4">
                                        <View className="flex-row justify-between items-start mb-2">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-lg font-semibold text-gray-900 mb-1">
                                                    {getProjectTitle(project)}
                                                </Text>
                                                <Text className="text-sm text-gray-600 mb-1">
                                                    {getProjectCategory(project)}
                                                </Text>
                                                <Text className="text-xs text-gray-500">
                                                    📍 {getProjectLocation(project)}
                                                </Text>
                                            </View>
                                            <View className={`px-3 py-1 rounded-full ${status.color}`}>
                                                <Text className="text-xs font-medium">
                                                    {status.label}
                                                </Text>
                                            </View>
                                        </View>

                                        {project?.projectBasicDetail?.projectYearOfCompletion && (
                                            <Text className="text-xs text-gray-500 mb-3">
                                                Completed: {project.projectBasicDetail.projectYearOfCompletion}
                                            </Text>
                                        )}

                                        <View className="flex-row gap-2 mt-3">
                                            <TouchableOpacity
                                                className="flex-1 bg-primary-600 rounded-lg py-2 px-4"
                                                onPress={() => {
                                                    // TODO: Navigate to project details screen
                                                    navigation.navigate('ProjectDetails', { projectId: project.id || project._id });
                                                }}
                                            >
                                                <Text className="text-white text-center font-medium">
                                                    View Details
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="bg-red-100 rounded-lg py-2 px-4"
                                                onPress={() => handleDeleteProject(project.id || project._id)}
                                            >
                                                <Text className="text-red-700 font-medium">🗑️</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

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

export default ProjectsScreen;
