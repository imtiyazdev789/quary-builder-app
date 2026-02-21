import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon, { IconNames } from '../../components/Icon';

const SignupSelectionScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
            <View className="flex-1 justify-center px-6">
                {/* Premium Header */}
                <View style={s.headerWrap}>
                    <LinearGradient
                        colors={['#f0fdfa', '#ccfbf1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.headerGradient}
                    >
                        <View style={s.logoCircle}>
                            <Icon name={IconNames.person} size="xxl" color="#0d9488" />
                        </View>
                    </LinearGradient>
                    <Text style={s.title}>Join BuildQuery</Text>
                    <Text style={s.subtitle}>What describes you best?</Text>
                </View>

                {/* Client Option */}
                <TouchableOpacity
                    style={s.optionCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('ClientSignup')}
                >
                    <LinearGradient
                        colors={['#f0fdfa', '#ccfbf1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.optionIcon}
                    >
                        <Icon name={IconNames.home} size="xl" color="#0d9488" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                        <Text style={s.optionTitle}>I'm a Client</Text>
                        <Text style={s.optionDesc}>Looking for architects, designers & contractors</Text>
                    </View>
                    <View style={s.arrowCircle}>
                        <Icon name={IconNames.chevronForward} size="md" color="#0d9488" />
                    </View>
                </TouchableOpacity>

                {/* Professional Option */}
                <TouchableOpacity
                    style={s.optionCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('ProfessionalSignup')}
                >
                    <LinearGradient
                        colors={['#ede9fe', '#ddd6fe']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.optionIcon}
                    >
                        <Icon name={IconNames.briefcase} size="xl" color="#7c3aed" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                        <Text style={s.optionTitle}>I'm a Professional</Text>
                        <Text style={s.optionDesc}>Architect, Designer, Consultant or Contractor</Text>
                    </View>
                    <View style={[s.arrowCircle, { backgroundColor: '#f5f3ff' }]}>
                        <Icon name={IconNames.chevronForward} size="md" color="#7c3aed" />
                    </View>
                </TouchableOpacity>

                {/* Already have account */}
                <View style={s.bottomLink}>
                    <Text style={s.bottomLinkText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={s.bottomLinkAction}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const s = StyleSheet.create({
    headerWrap: {
        alignItems: 'center',
        marginBottom: 36,
    },
    headerGradient: {
        width: 88,
        height: 88,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoCircle: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(13,148,136,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
    },
    optionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    optionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 3,
    },
    optionDesc: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    arrowCircle: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: '#f0fdfa',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    bottomLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    bottomLinkText: {
        color: '#64748b',
        fontSize: 15,
    },
    bottomLinkAction: {
        color: '#0d9488',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default SignupSelectionScreen;
