import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getMessageOfConversationApi, sendMessageAPI } from '../../services/ChatService';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

const MessageScreen = ({ route, navigation }: any) => {
    const { userData, conversationId, members, conversationImage } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollToBottom()
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true })
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    useEffect(() => {
        getMessageOfConversation(conversationId);

    }, []);

    const getMessageOfConversation = async (conversationId: string) => {
        setIsLoading(true);
        try {
            const res = await getMessageOfConversationApi(conversationId);
            const { data } = res;
            setMessage(data);
        } catch (error) {
            alert(error);
        }
        setIsLoading(false);
    };

    const renderMessageItem = ({ item, index }) => {
        const shouldDisplayCreatedAt = shouldDisplayDay(index);
        const senderInfo = members.find(member => member._id === item.sender._id);
        const senderName = senderInfo ? senderInfo.username : null;
        const isUserDataSender = item.sender._id === userData._id;
        const senderNameStyle = [styles.senderName, {
            alignSelf: isUserDataSender ? 'flex-end' : 'flex-start',
        }];
        let showSenderName = false;
        if (index === 0 || item.sender._id !== message[index - 1].sender._id) {
            showSenderName = true;
        }
        return (
            <View>
                <View style={{ alignItems: "center" }}>
                    {shouldDisplayCreatedAt &&
                        <Text style={styles.createdAtText}>
                            {createdAtDay(item?.createdAt)}
                        </Text>}
                </View>
                {showSenderName && (
                    <Text style={senderNameStyle}>{senderName}</Text>
                )}
                <TouchableOpacity
                    style={[
                        styles.messageContainer,
                        {
                            alignSelf: isUserDataSender ? 'flex-end' : 'flex-start',
                            backgroundColor: isUserDataSender ? "#DCF8C6" : '#fff',
                        },
                    ]}
                >
                    <Text style={styles.messageText}>{item?.text}</Text>
                    <Text style={styles.timeText}>
                        {timeInMessage(item?.createdAt)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    let lastDisplayedDate = null;
    const shouldDisplayDay = (index) => {
        const currentMessage = message[index];
        const currentMessageCreatedAt = moment(currentMessage.createdAt);
        const currentDay = currentMessageCreatedAt.startOf('day');

        if (index === 0) {
            lastDisplayedDate = currentDay;
            return true;
        }
        const previousMessage = message[index - 1];
        const previousMessageCreatedAt = moment(previousMessage.createdAt);
        const previousDay = previousMessageCreatedAt.startOf('day');

        if (currentDay.isAfter(previousDay, 'day')) {
            lastDisplayedDate = currentDay;
            return true;
        }
        return false;
    }
    const createdAtDay = (createdAt) => {
        const momentCreatedAt = moment(createdAt);
        const today = moment().startOf('day');
        const yesterday = moment().startOf('day').subtract(1, 'days');

        if (momentCreatedAt.isSameOrAfter(today)) {
            return 'Hôm nay';
        } else if (momentCreatedAt.isSameOrAfter(yesterday)) {
            return 'Hôm qua';
        } else {
            return momentCreatedAt.format('DD/MM/YYYY');
        }
    };

    const timeInMessage = (createdAt) => {
        return moment(createdAt).format('HH:mm');
    };

    const sendMessage = async () => {
        setNewMessage(newMessage.trim());
        if (newMessage.trim() === '') return;
        try {
            const newMessageObject = {
                conversationId: conversationId,
                text: newMessage,
                sender: userData._id
            };
            const messageResponse = await sendMessageAPI(newMessageObject);
            const { data } = messageResponse;
            setMessage([...message, data]);
            setNewMessage('');
        } catch (err) {
            alert(err);
        }
    }
    // const handleSend = async (messageType, imageUri) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append("senderId", userId);
    //         formData.append("recepientId", recepientId);

    //         //if the message type id image or a normal text
    //         if (messageType === "image") {
    //             formData.append("messageType", "image");
    //             formData.append("imageFile", {
    //                 uri: imageUri,
    //                 name: "image.jpg",
    //                 type: "image/jpeg",
    //             });
    //         } else {
    //             formData.append("messageType", "text");
    //             formData.append("messageText", message);
    //         }

    //         const response = await fetch("http://localhost:8000/messages", {
    //             method: "POST",
    //             body: formData,
    //         });

    //         if (response.ok) {
    //             setMessage("");
    //             setSelectedImage("");

    //             fetchMessages();
    //         }
    //     } catch (error) {
    //         console.log("error in sending the message", error);
    //     }
    // };

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <View style={styles.header}>
                    <Ionicons style={{ left: 10, position: "absolute" }} name="arrow-back-outline" size={35}
                        onPress={() => { navigation.navigate("HomeTabs", { name: 'FriendScreen' }) }} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                            style={styles.conversationImage}
                            source={{ uri: conversationImage }}
                        />
                        <Text style={styles.headerText}>
                            {members.map(member => member.username).join(', ')}
                        </Text>
                    </View>

                </View>
            </View>
            <View style={styles.flatListContainer}>
                <FlatList
                    ref={scrollViewRef}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={handleContentSizeChange}
                    initialNumToRender={message.length}
                    onRefresh={() => getMessageOfConversation(conversationId)}
                    refreshing={isLoading}
                    renderItem={(item) => renderMessageItem(item)}
                    data={message}
                // inverted
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.icon}>
                    <MaterialIcons name="insert-photo" size={30} color="gray" />
                </TouchableOpacity>
                <TextInput
                    style={styles.messageInput}
                    placeholder='Tin nhắn'
                    value={newMessage}
                    multiline={true}
                    placeholderTextColor="#888"
                    onChangeText={(value) => {
                        setNewMessage(value);
                    }}
                />
                <TouchableOpacity
                    style={styles.icon}
                    onPress={sendMessage}
                >
                    <MaterialIcons name="send" size={30} color="blue" />
                </TouchableOpacity>
            </View>
            <StatusBar style="dark" />
        </View>
    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        top: getStatusBarHeight(),
        flex: 1,
    },
    heading: {
        position: "relative",
        alignItems: "center",
        width: "100%",
        height: "8%",
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: "center",
        width: "100%",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    conversationImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10
    },
    flatListContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f3f4fb",
        flexDirection: "column-reverse"
    },
    messageContainer: {
        padding: 8,
        borderRadius: 10,
        margin: 5,
        maxWidth: '70%',
        borderColor: "#d4d5d6",
        borderWidth: 1,
    },
    senderName: {
        fontSize: 14,
        color: "gray",
    },
    messageText: {
        fontSize: 16,
    },
    timeText: {
        fontSize: 11,
        color: "gray",
        textAlign: "left",
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        borderTopColor: '#dedede',
        borderTopWidth: 1,
    },
    createdAtText: {
        textAlign: "center",
        color: "white",
        backgroundColor: "#adacaa",
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 13,
        margin: 10,
    },
    messageInput: {
        width: "70%",
        maxHeight: 150,
        minHeight: 70,
        padding: 10,
        textAlign: 'left',
        fontSize: 20,
    },
    icon: {
        paddingHorizontal: 10,
        flex: 1,
        padding: 10,
    },
});