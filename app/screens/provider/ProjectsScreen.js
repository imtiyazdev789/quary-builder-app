import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const ProjectsScreen = () => {
    const projects = [
        { id: 1, name: 'E-commerce Website', client: 'ABC Corp', progress: 75, status: 'In Progress' },
        { id: 2, name: 'Mobile App Development', client: 'XYZ Ltd', progress: 45, status: 'In Progress' },
        { id: 3, name: 'Brand Identity Design', client: 'Tech Inc', progress: 100, status: 'Completed' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        Projects
                    </Text>

                    {projects.map((project) => (
                        <View
                            key={project.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-900">
                                        {project.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        Client: {project.client}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full ${project.status === 'Completed' ? 'bg-green-100' : 'bg-blue-100'
                                    }`}>
                                    <Text className="text-xs font-medium text-gray-800">
                                        {project.status}
                                    </Text>
                                </View>
                            </View>
                            <View className="mb-3">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-sm text-gray-600">Progress</Text>
                                    <Text className="text-sm font-medium text-gray-900">{project.progress}%</Text>
                                </View>
                                <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-blue-600 rounded-full"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity className="bg-blue-600 rounded-lg py-2 px-4">
                                <Text className="text-white text-center font-medium">
                                    View Details
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ProjectsScreen;

