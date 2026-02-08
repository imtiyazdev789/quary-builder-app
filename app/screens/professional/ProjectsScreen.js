import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, Icon, IconNames, FadeInView, AnimatedCard } from '../../components';

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
                icon: 'close-circle',
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
            icon: 'warning',
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
                    icon: 'checkmark-circle',
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
                icon: 'close-circle',
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
                <View className="px-6 pt-8 pb-4">
                    {/* Header */}
                    <FadeInView delay={100} className="flex-row justify-between items-center mb-8">
                        <Text className="text-3xl font-bold text-secondary-900">
                            Projects
                        </Text>
                        <TouchableOpacity
                            className="bg-primary-600 rounded-xl px-4 py-2.5 shadow-sm"
                            onPress={() => {
                                showAlert({
                                    title: 'Coming Soon',
                                    message: 'Project creation feature will be available soon.',
                                    icon: 'construct',
                                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                                });
                            }}
                        >
                            <Text className="text-white font-bold text-sm tracking-wide">+ Add</Text>
                        </TouchableOpacity>
                    </FadeInView>

                    {projects.length === 0 ? (
                        <FadeInView delay={300} className="flex-1 justify-center items-center py-32">
                            <Text className="text-base text-secondary-400 text-center font-medium">
                                No projects yet.
                            </Text>
                        </FadeInView>
                    ) : (
                        projects.map((project, index) => {
                            const status = getProjectStatus(project);
                            const projectImage = getProjectImage(project);

                            return (
                                <FadeInView key={project.id || project._id} delay={200 + index * 100}>
                                    <AnimatedCard
                                        onPress={() => navigation.navigate('ProjectDetails', { projectId: project.id || project._id })}
                                        className="bg-white rounded-[24px] mb-6 shadow-sm border border-secondary-100 overflow-hidden"
                                    >
                                        {/* Project Image */}
                                        <View className="relative">
                                            {projectImage ? (
                                                <Image
                                                    source={{ uri: projectImage }}
                                                    className="w-full h-56"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="w-full h-56 bg-secondary-100 items-center justify-center">
                                                    <Icon name={IconNames.image} size="xl" color="#94a3b8" />
                                                </View>
                                            )}
                                            <View className={`absolute top-4 right-4 px-3 py-1.5 rounded-full ${status.color} shadow-sm`}>
                                                <Text className="text-[10px] font-bold uppercase tracking-wider">
                                                    {status.label}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="p-5">
                                            <View className="flex-row justify-between items-start mb-3">
                                                <View className="flex-1">
                                                    <Text className="text-xl font-bold text-secondary-900 mb-1">
                                                        {getProjectTitle(project)}
                                                    </Text>
                                                    <View className="flex-row items-center">
                                                        <View className="bg-primary-50 px-2 py-0.5 rounded mr-2">
                                                            <Text className="text-[10px] font-bold text-primary-700 uppercase">
                                                                {getProjectCategory(project)}
                                                            </Text>
                                                        </View>
                                                        {project?.projectBasicDetail?.projectYearOfCompletion && (
                                                            <Text className="text-xs text-secondary-400">
                                                                • {project.projectBasicDetail.projectYearOfCompletion}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="flex-row items-center mb-4">
                                                <Icon name={IconNames.location} size="xs" color="#64748b" style={{ marginRight: 4 }} />
                                                <Text className="text-sm text-secondary-500 font-medium">
                                                    {getProjectLocation(project)}
                                                </Text>
                                            </View>

                                            <View className="flex-row items-center justify-between pt-4 border-t border-secondary-50">
                                                <View className="flex-row items-center">
                                                    <Text className="text-primary-600 font-bold text-sm">View Case Study</Text>
                                                    <Icon name={IconNames.chevronForward} size="xs" color="#0d9488" style={{ marginLeft: 4 }} />
                                                </View>
                                                <TouchableOpacity
                                                    className="bg-error-50 p-2.5 rounded-xl border border-error-100"
                                                    onPress={() => handleDeleteProject(project.id || project._id)}
                                                >
                                                    <Icon name={IconNames.trash} size="sm" color="#ef4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </AnimatedCard>
                                </FadeInView>
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
