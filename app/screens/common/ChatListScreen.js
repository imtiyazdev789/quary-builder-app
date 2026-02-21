import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../../config/axios";
import Router from "../../config/Router";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

const ChatListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const { socket } = useSocket();

    const fetchConversations = useCallback(async () => {
        try {
            const response = await api.get(Router.CHAT.GET_CONVERSATIONS);
            if (response.data.success) {
                setConversations(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Listen for new messages via Socket.io
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            console.log("New message received:", message);
            // Update conversation list
            fetchConversations();
        };

        const handleConversationCreated = (conversation) => {
            console.log("New conversation created:", conversation);
            // Refresh conversation list
            fetchConversations();
        };

        socket.on("new-message", handleNewMessage);
        socket.on("conversation-created", handleConversationCreated);

        return () => {
            socket.off("new-message", handleNewMessage);
            socket.off("conversation-created", handleConversationCreated);
        };
    }, [socket, fetchConversations]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchConversations();
    };

    const getUnreadCount = (conversation) => {
        if (!user) return 0;
        return user.role === "user"
            ? conversation.unreadCountClient || 0
            : conversation.unreadCountProfessional || 0;
    };

    const getOtherPartyName = (conversation) => {
        if (!user) return "Unknown";
        if (user.role === "user") {
            return (
                conversation.professionalId?.businessName ||
                conversation.professionalId?.representativeName ||
                "Professional"
            );
        } else {
            return (
                (conversation.clientId?.firstName || "") +
                " " +
                (conversation.clientId?.lastName || "")
            ).trim() || "Client";
        }
    };

    const formatTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return "Just now";
    };

    const renderConversation = ({ item }) => {
        const unreadCount = getUnreadCount(item);
        const otherPartyName = getOtherPartyName(item);

        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("ChatRoom", {
                        conversationId: item._id,
                        otherPartyName,
                    })
                }
                className="flex-row items-center p-4 border-b border-gray-200 bg-white"
            >
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="person" size={24} color="#3b82f6" />
                </View>

                {/* Content */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-semibold text-gray-900">
                            {otherPartyName}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {formatTime(item.lastMessageAt || item.createdAt)}
                        </Text>
                    </View>
                    <Text
                        numberOfLines={1}
                        className={`text-sm ${unreadCount > 0
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                            }`}
                    >
                        {item.lastMessage || "No messages yet"}
                    </Text>
                </View>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <View className="ml-2 bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            {/* <View className="bg-white border-b border-gray-200 p-4">
                <Text className="text-2xl font-bold text-gray-900">Messages</Text>
            </View> */}

            {/* Conversation List */}
            {conversations.length === 0 ? (
                <View className="flex-1 items-center justify-center p-6">
                    <Ionicons name="chatbubbles-outline" size={64} color="#9ca3af" />
                    <Text className="text-lg font-medium text-gray-600 mt-4 text-center">
                        No conversations yet
                    </Text>
                    <Text className="text-sm text-gray-500 mt-2 text-center">
                        {user?.role === "user"
                            ? "Start chatting once a professional accepts your request"
                            : "Accept a service request to start chatting with clients"}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderConversation}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default ChatListScreen;
