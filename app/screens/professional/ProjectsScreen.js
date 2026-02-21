import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    StyleSheet,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, Icon, IconNames, FadeInView, AnimatedCard } from '../../components';
import { SkeletonCard } from '../../components/SkeletonLoader';

const STATUS_CONFIG = {
    published: { label: 'Published', bg: '#ecfdf5', color: '#065f46' },
    draft: { label: 'Draft', bg: '#fef3c7', color: '#92400e' },
    default: { label: 'Unpublished', bg: '#f1f5f9', color: '#475569' },
};

const ProjectsScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', icon: '', buttons: [] });

    useEffect(() => { fetchProjects(); }, []);
    useFocusEffect(useCallback(() => { fetchProjects(); }, []));

    const showAlert = (config) => { setAlertConfig(config); setAlertVisible(true); };
    const hideAlert = () => setAlertVisible(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.PROFESSIONAL.FETCH_PROJECTS);
            if (response.data.success) {
                const data = (response.data.data || []).sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt));
                setProjects(data);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            showAlert({ title: 'Error', message: 'Failed to load projects. Please try again.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
            setProjects([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => { setRefreshing(true); fetchProjects(); };

    const getProjectTitle = (p) => p?.projectBasicDetail?.projectTitle || 'Untitled Project';
    const getProjectCategory = (p) => p?.projectBasicDetail?.projectCategory || 'N/A';
    const getProjectLocation = (p) => {
        const city = p?.projectBasicDetail?.projectCity || '';
        const state = p?.projectBasicDetail?.projectState || '';
        return city && state ? `${city}, ${state}` : city || state || 'Location not specified';
    };
    const getProjectStatus = (p) => {
        if (p?.isPublished) return STATUS_CONFIG.published;
        if (p?.isDraft) return STATUS_CONFIG.draft;
        return STATUS_CONFIG.default;
    };
    const getProjectImage = (p) => {
        const images = p?.projectImage || [];
        if (!images.length) return null;
        let url = typeof images[0] === 'string' ? images[0] : images[0].url || images[0].uri || '';
        if (url && Platform.OS === 'android' && url.includes('localhost'))
            url = url.replace('localhost', '10.0.2.2');
        if (url && !url.startsWith('http')) {
            const base = process.env.EXPO_PUBLIC_API_BASE_URL || '';
            url = `${base}${url.replace(/^\//, '')}`;
        }
        return url || null;
    };

    const handleDeleteProject = (projectId) => {
        showAlert({
            title: 'Delete Project',
            message: 'Are you sure you want to delete this project? This cannot be undone.',
            icon: 'warning',
            buttons: [
                { text: 'Cancel', onPress: hideAlert, style: 'secondary' },
                { text: 'Delete', onPress: async () => { hideAlert(); await deleteProject(projectId); }, style: 'danger' },
            ],
        });
    };

    const deleteProject = async (projectId) => {
        try {
            setLoading(true);
            const response = await api.delete(Router.PROFESSIONAL.DELETE_PROJECT(projectId));
            if (response.data.success) {
                showAlert({ title: 'Deleted', message: 'Project deleted successfully.', icon: 'checkmark-circle', buttons: [{ text: 'OK', onPress: () => { hideAlert(); fetchProjects(); }, style: 'primary' }] });
            } else {
                throw new Error(response.data.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            showAlert({ title: 'Error', message: error.response?.data?.message || 'Failed to delete project.', icon: 'close-circle', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top + 20 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 40, marginBottom: 16 }}>
                    <View style={{ width: 120, height: 28, borderRadius: 8, backgroundColor: '#e2e8f0' }} />
                    <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', marginTop: 8 }} />
                </View>
                {[1, 2].map(i => <View key={i} style={{ paddingHorizontal: 20, marginBottom: 14 }}><SkeletonCard /></View>)}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0d9488']} />}
            >
                {/* ── Header ─────────────────────── */}
                <FadeInView delay={100}>
                    <View style={styles.pageHeader}>
                        <View>
                            <Text style={styles.pageTitle}>Projects</Text>
                            <View style={styles.accentBar} />
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => showAlert({ title: 'Coming Soon', message: 'Project creation will be available soon.', icon: 'construct', buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }] })}
                        >
                            <Icon name={IconNames.add} size="sm" color="#ffffff" />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </FadeInView>

                <View style={{ paddingHorizontal: 20 }}>
                    {projects.length === 0 ? (
                        <FadeInView delay={300}>
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconCircle}>
                                    <Icon name={IconNames.briefcase} size="xl" color="#94a3b8" />
                                </View>
                                <Text style={styles.emptyTitle}>No Projects Yet</Text>
                                <Text style={styles.emptySubtext}>Your completed projects will appear here.</Text>
                            </View>
                        </FadeInView>
                    ) : (
                        projects.map((project, index) => {
                            const status = getProjectStatus(project);
                            const projectImage = getProjectImage(project);
                            const year = project?.projectBasicDetail?.projectYearOfCompletion;

                            return (
                                <FadeInView key={project.id || project._id} delay={200 + index * 100}>
                                    <AnimatedCard
                                        onPress={() => navigation.navigate('ProjectDetails', { projectId: project.id || project._id })}
                                        style={styles.projectCard}
                                    >
                                        {/* Image */}
                                        <View>
                                            {projectImage ? (
                                                <Image source={{ uri: projectImage }} style={styles.projectImage} resizeMode="cover" />
                                            ) : (
                                                <View style={[styles.projectImage, styles.projectImagePlaceholder]}>
                                                    <Icon name={IconNames.image} size="xl" color="#94a3b8" />
                                                </View>
                                            )}
                                            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                                            </View>
                                        </View>

                                        {/* Content */}
                                        <View style={styles.projectContent}>
                                            <Text style={styles.projectTitle} numberOfLines={1}>{getProjectTitle(project)}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                                                <View style={styles.categoryBadge}>
                                                    <Text style={styles.categoryText}>{getProjectCategory(project)}</Text>
                                                </View>
                                                {year && <Text style={styles.yearText}>• {year}</Text>}
                                            </View>

                                            <View style={styles.projectMeta}>
                                                <Icon name={IconNames.location} size="xs" color="#64748b" />
                                                <Text style={styles.projectMetaText}>{getProjectLocation(project)}</Text>
                                            </View>

                                            <View style={styles.projectFooter}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Text style={styles.viewCaseStudy}>View Case Study</Text>
                                                    <Icon name={IconNames.chevronForward} size="xs" color="#0d9488" />
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
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

            <CustomAlert visible={alertVisible} title={alertConfig.title} message={alertConfig.message}
                icon={alertConfig.icon} buttons={alertConfig.buttons} onClose={hideAlert} />
        </View>
    );
};

const styles = StyleSheet.create({
    // ── Page Header ─────────────────────
    pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 20 },
    pageTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
    accentBar: { width: 48, height: 4, borderRadius: 2, backgroundColor: '#0d9488', marginTop: 8 },
    addButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d9488',
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, gap: 6,
        ...Platform.select({ ios: { shadowColor: '#0d9488', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6 }, android: { elevation: 4 } }),
    },
    addButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },

    // ── Project Card ───────────────────
    projectCard: {
        backgroundColor: '#ffffff', borderRadius: 24, marginBottom: 20, overflow: 'hidden',
        ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }),
    },
    projectImage: { width: '100%', height: 220 },
    projectImagePlaceholder: { backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
    statusBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    projectContent: { padding: 18 },
    projectTitle: { fontSize: 19, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
    categoryBadge: { backgroundColor: '#f0fdfa', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    categoryText: { fontSize: 11, fontWeight: '700', color: '#0d9488', textTransform: 'uppercase' },
    yearText: { fontSize: 12, color: '#94a3b8' },
    projectMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
    projectMetaText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
    projectFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    viewCaseStudy: { fontSize: 14, fontWeight: '700', color: '#0d9488' },
    deleteButton: { backgroundColor: '#fef2f2', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca' },

    // ── Empty State ─────────────────────
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyIconCircle: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#64748b', textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});

export default ProjectsScreen;
