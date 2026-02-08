import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { IconNames } from '../../components/Icon';
import theme from '../../config/theme';

const SignupSelectionScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
            <View className="flex-1 justify-center px-6">
                {/* Header */}
                <View className="mb-12">
                    <Text className="text-4xl font-bold text-secondary-900 mb-3">
                        Join BuildQuery
                    </Text>
                    <Text className="text-lg text-secondary-500">
                        What describes you best?
                    </Text>
                </View>

                {/* Client Option */}
                <TouchableOpacity
                    className="bg-white border-2 border-secondary-200 rounded-2xl p-6 mb-4"
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('ClientSignup')}
                >
                    <View className="flex-row items-center">
                        <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
                            <Icon name={IconNames.home} size="xxl" color={theme.colors.primary[500]} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-secondary-900 mb-1">
                                I'm a Client
                            </Text>
                            <Text className="text-sm text-secondary-500">
                                Looking for architects, designers & contractors
                            </Text>
                        </View>
                        <Text className="text-2xl text-secondary-300">→</Text>
                    </View>
                </TouchableOpacity>

                {/* Professional Option */}
                <TouchableOpacity
                    className="bg-white border-2 border-secondary-200 rounded-2xl p-6 mb-8"
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('ProfessionalSignup')}
                >
                    <View className="flex-row items-center">
                        <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
                            <Icon name={IconNames.briefcase} size="xxl" color={theme.colors.primary[500]} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-secondary-900 mb-1">
                                I'm a Professional
                            </Text>
                            <Text className="text-sm text-secondary-500">
                                Architect, Designer, Consultant or Contractor
                            </Text>
                        </View>
                        <Text className="text-2xl text-secondary-300">→</Text>
                    </View>
                </TouchableOpacity>

                {/* Already have account */}
                <View className="flex-row justify-center items-center">
                    <Text className="text-secondary-500 text-base">
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-primary-600 font-semibold text-base">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignupSelectionScreen;

