import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const ProjectScreen = () => {
    const projects = [
        { id: 1, name: 'Website Redesign', client: 'ABC Corp', status: 'In Progress' },
        { id: 2, name: 'Mobile App', client: 'XYZ Ltd', status: 'Planning' },
        { id: 3, name: 'E-commerce Platform', client: 'Tech Inc', status: 'Completed' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-3xl font-bold text-gray-900">
                            Projects
                        </Text>
                        <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
                            <Text className="text-white font-medium">+ New</Text>
                        </TouchableOpacity>
                    </View>

                    {projects.map((project) => (
                        <View
                            key={project.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <Text className="text-lg font-semibold text-gray-900 mb-1">
                                {project.name}
                            </Text>
                            <Text className="text-sm text-gray-600 mb-2">
                                Client: {project.client}
                            </Text>
                            <View className="flex-row justify-between items-center">
                                <View className={`px-3 py-1 rounded-full ${project.status === 'Completed' ? 'bg-green-100' :
                                        project.status === 'In Progress' ? 'bg-blue-100' : 'bg-yellow-100'
                                    }`}>
                                    <Text className="text-xs font-medium text-gray-800">
                                        {project.status}
                                    </Text>
                                </View>
                                <TouchableOpacity>
                                    <Text className="text-blue-600 font-medium">View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ProjectScreen;

