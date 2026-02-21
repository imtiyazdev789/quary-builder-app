import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Icon, IconNames, FadeInView, AnimatedCard } from '../../components';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ProfessionalDashboard = ({ navigation }) => {
    const { user } = useAuth();

    const stats = [
        {
            label: 'Active Leads',
            value: '12',
            icon: IconNames.briefcase,
            color: '#3b82f6', // blue-500
            bgColor: '#eff6ff', // blue-50
            screen: 'Leads'
        },
        {
            label: 'Projects',
            value: '8',
            icon: IconNames.images,
            color: '#10b981', // emerald-500
            bgColor: '#ecfdf5', // emerald-50
            screen: 'Projects'
        },
        {
            label: 'Avg Rating',
            value: '4.8',
            icon: IconNames.starFilled,
            color: '#8b5cf6', // violet-500
            bgColor: '#f5f3ff', // violet-50
            screen: 'Reviews'
        },
        {
            label: 'Earnings',
            value: '₹14.5k',
            icon: IconNames.cash,
            color: '#f59e0b', // amber-500
            bgColor: '#fffbeb', // amber-50
            screen: 'Wallet'
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pt-14 pb-6">
                    <FadeInView delay={100}>
                        <View className="mb-10">
                            <Text className="text-3xl font-bold text-secondary-900 leading-tight">
                                {user?.name || 'Professional'}
                            </Text>
                            <View className="h-1.5 w-12 bg-primary-500 mt-3 rounded-full" />
                        </View>
                    </FadeInView>

                    <FadeInView delay={300}>
                        <View className="flex-row flex-wrap justify-between mb-8">
                            {stats.map((stat, index) => (
                                <AnimatedCard
                                    key={index}
                                    onPress={() => stat.screen && navigation.navigate(stat.screen)}
                                    className="mb-4 rounded-3xl overflow-hidden"
                                    style={{ width: CARD_WIDTH }}
                                >
                                    <View className="p-5" style={{ backgroundColor: stat.bgColor }}>
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="p-2.5 rounded-2xl bg-white shadow-sm">
                                                <Icon name={stat.icon} size="sm" color={stat.color} />
                                            </View>
                                            <Icon name={IconNames.chevronForward} size="xs" color={stat.color} />
                                        </View>
                                        <Text className="text-2xl font-bold text-secondary-900 mb-1">
                                            {stat.value}
                                        </Text>
                                        <Text className="text-xs font-semibold text-secondary-500 uppercase tracking-tight">
                                            {stat.label}
                                        </Text>
                                    </View>
                                </AnimatedCard>
                            ))}
                        </View>
                    </FadeInView>

                    <FadeInView delay={500}>
                        <View className="mb-6">
                            <Text className="text-xl font-bold text-secondary-900 mb-4">
                                Quick Actions
                            </Text>
                            <View className="flex-row justify-between">
                                <TouchableOpacity
                                    className="items-center bg-primary-50 px-4 py-4 rounded-3xl flex-1 mr-3"
                                    onPress={() => navigation.navigate('CreateProject')}
                                >
                                    <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
                                        <Icon name={IconNames.add} size="md" color="#0d9488" />
                                    </View>
                                    <Text className="text-xs font-bold text-primary-800 text-center">New Project</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="items-center bg-secondary-50 px-4 py-4 rounded-3xl flex-1 mr-3"
                                    onPress={() => navigation.navigate('Portfolio')}
                                >
                                    <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
                                        <Icon name={IconNames.image} size="md" color="#475569" />
                                    </View>
                                    <Text className="text-xs font-bold text-secondary-800 text-center">Portfolio</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="items-center bg-orange-50 px-4 py-4 rounded-3xl flex-1"
                                    onPress={() => navigation.navigate('UpdateProfile')}
                                >
                                    <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
                                        <Icon name={IconNames.person} size="md" color="#ea580c" />
                                    </View>
                                    <Text className="text-xs font-bold text-orange-800 text-center">My Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </FadeInView>

                    {/* Recent Activity Placeholder */}
                    <FadeInView delay={700}>
                        <View className="mt-4 p-6 bg-secondary-900 rounded-[32px] overflow-hidden">
                            <View className="relative z-10">
                                <Text className="text-white text-lg font-bold mb-2">Build your reputation</Text>
                                <Text className="text-secondary-300 text-sm mb-4 leading-5">
                                    Completing projects and getting good reviews helps you get more leads.
                                </Text>
                                <TouchableOpacity className="bg-white px-6 py-3 rounded-full self-start">
                                    <Text className="text-secondary-900 font-bold text-sm">View Tips</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="absolute -right-10 -bottom-10 opacity-10">
                                <Icon name={IconNames.briefcase} size={150} color="white" />
                            </View>
                        </View>
                    </FadeInView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfessionalDashboard;

