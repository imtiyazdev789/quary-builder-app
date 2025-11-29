import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import ExampleCard from '../components/ExampleCard';

const HomeScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Home
                    </Text>
                    <Text className="text-base text-gray-600 mb-6">
                        This is your home screen with Tailwind CSS styling
                    </Text>

                    <View className="space-y-4">
                        <ExampleCard
                            title="Card 1"
                            description="This is an example card component"
                        />
                        <ExampleCard
                            title="Card 2"
                            description="Another example card with Tailwind styling"
                        />
                        <ExampleCard
                            title="Card 3"
                            description="Query Builder App - Built with React Native & Tailwind"
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

