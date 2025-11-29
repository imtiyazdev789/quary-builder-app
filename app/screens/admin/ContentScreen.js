import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';

const ContentScreen = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const blogs = [
        { id: 1, title: 'Getting Started with React Native', date: '2024-01-15', status: 'Published' },
        { id: 2, title: 'Best Practices for Mobile Apps', date: '2024-01-18', status: 'Draft' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        Blog Creation
                    </Text>

                    <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                            Create New Blog
                        </Text>
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Title
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter blog title"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Content
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base h-32"
                                placeholder="Write your blog content..."
                                value={content}
                                onChangeText={setContent}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                        <TouchableOpacity className="bg-blue-600 rounded-lg py-3 px-4">
                            <Text className="text-white text-center font-semibold">
                                Publish Blog
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xl font-semibold text-gray-900 mb-4">
                        Recent Blogs
                    </Text>
                    {blogs.map((blog) => (
                        <View
                            key={blog.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <Text className="text-lg font-semibold text-gray-900 mb-1">
                                {blog.title}
                            </Text>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm text-gray-600">
                                    {blog.date}
                                </Text>
                                <View className={`px-3 py-1 rounded-full ${blog.status === 'Published' ? 'bg-green-100' : 'bg-yellow-100'
                                    }`}>
                                    <Text className="text-xs font-medium text-gray-800">
                                        {blog.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ContentScreen;

