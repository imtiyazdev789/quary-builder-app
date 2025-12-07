import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const projects = [
    { id: 'BQ-2201', client: 'Rahul K', stage: 'Awaiting Proposal', status: 'warning' },
    { id: 'BQ-2184', client: 'Neha P', stage: 'Design Review', status: 'info' },
    { id: 'BQ-2150', client: 'ACME Corp', stage: 'Construction', status: 'success' },
];

const stageStyles = {
    warning: 'text-orange-600',
    info: 'text-blue-600',
    success: 'text-green-600',
};

const AdminProjectsScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Project Monitor</Text>
                <Text className="text-base text-gray-600 mb-6">Track live projects across the network</Text>

                {projects.map((project) => (
                    <View key={project.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-lg font-semibold text-gray-900">{project.id}</Text>
                            <Text className="text-sm text-gray-500">{project.client}</Text>
                        </View>
                        <Text className={`text-base font-medium ${stageStyles[project.status]}`}>
                            {project.stage}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">Last updated 2h ago</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminProjectsScreen;


