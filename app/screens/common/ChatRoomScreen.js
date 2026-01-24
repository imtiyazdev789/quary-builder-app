import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../../config/axios";
import Router from "../../config/Router";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

const ChatRoomScreen = ({ route, navigation }) => {
    // Handle both direct params (from list) and conversation object (from request details)
    const { conversation } = route.params || {};
    let { conversationId, otherPartyName } = route.params || {};
    const { user } = useAuth();

    // If conversation object is passed, extract id and determine name
    if (conversation) {
        conversationId = conversation._id;
        if (!otherPartyName) {
            // Determine other party name based on current user role
            if (user?.role === 'professional') {
                otherPartyName = conversation.clientId?.firstName
                    ? `${conversation.clientId.firstName} ${conversation.clientId.lastName}`
                    : 'Client';
            } else {
                otherPartyName = conversation.professionalId?.businessName || 'Professional';
            }
        }
    }
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const { socket } = useSocket();
    const flatListRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await api.get(Router.CHAT.GET_MESSAGES(conversationId));
            if (response.data.success) {
                setMessages(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Join conversation room and listen for messages
    useEffect(() => {
        if (!socket) return;

        // Join the conversation room
        socket.emit("join-conversation", conversationId);

        const handleNewMessage = (message) => {
            console.log("New message received:", message);
            setMessages((prev) => [...prev, message]);

            // Auto-scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);

            // Mark as read if message is from other party
            if (message.senderRole !== user?.role) {
                socket.emit("mark-read", { conversationId });
            }
        };

        socket.on("new-message", handleNewMessage);

        // Listen for socket errors (e.g. Unauthorized)
        const handleSocketError = (err) => {
            console.error("Socket error received:", err);
            alert(`Error: ${err.message || "Unknown socket error"}`);
            setSending(false);
        };
        socket.on("error", handleSocketError);

        // Mark messages as read when entering the room
        socket.emit("mark-read", { conversationId });

        return () => {
            socket.off("new-message", handleNewMessage);
            socket.off("error", handleSocketError);
        };
    }, [socket, conversationId, user]);

    const sendMessage = () => {
        console.log("Attempting to send message...", {
            text: messageText,
            socketConnected: !!socket,
            socketId: socket?.id,
            sendingStatus: sending,
            conversationId
        });

        if (!messageText.trim()) {
            console.log("Message text empty");
            return;
        }
        if (!socket) {
            console.log("Socket not connected");
            // alert("Chat service not connected. Please check internet or restart app.");
            return;
        }
        if (sending) {
            console.log("Already sending...");
            return;
        }

        setSending(true);
        try {
            socket.emit("send-message", {
                conversationId,
                messageText: messageText.trim(),
            });
            console.log("Message emitted via socket");
        } catch (error) {
            console.error("Socket emit error:", error);
        }

        setMessageText("");
        setSending(false);
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.senderRole === user?.role;

        return (
            <View
                className={`mb-3 px-4 ${isMyMessage ? "items-end" : "items-start"
                    }`}
            >
                <View
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMyMessage ? "bg-blue-500" : "bg-gray-200"
                        }`}
                >
                    <Text
                        className={`text-base ${isMyMessage ? "text-white" : "text-gray-900"
                            }`}
                    >
                        {item.messageText}
                    </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                    {formatTime(item.createdAt)}
                </Text>
            </View>
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
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="flex-row items-center bg-white border-b border-gray-200 p-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View className="ml-3 flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                        {otherPartyName}
                    </Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item._id}
                    contentContainerClassName="py-4"
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center p-6">
                            <Ionicons name="chatbubble-outline" size={48} color="#9ca3af" />
                            <Text className="text-gray-500 mt-2 text-center">
                                No messages yet. Start the conversation!
                            </Text>
                        </View>
                    }
                />

                {/* Input */}
                <View className="flex-row items-center border-t border-gray-200 p-4 bg-white pb-6">
                    <TextInput
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-base"
                        placeholder="Type a message..."
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!messageText.trim() || sending}
                        className={`w-10 h-10 rounded-full items-center justify-center ${messageText.trim() && !sending ? "bg-blue-500" : "bg-gray-300"
                            }`}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Ionicons
                                name="send"
                                size={20}
                                color="white"
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatRoomScreen;
