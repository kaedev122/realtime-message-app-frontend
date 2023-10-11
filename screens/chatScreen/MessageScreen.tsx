import React, { useState, useEffect } from 'react'
import { getMessageOfConversationApi, sendMessageAPI } from '../../services/ChatService'
import { Image, StyleSheet, Text, View, TextInput, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height

const MessageScreen = ({ route, navigation }: any) => {
    const { userData } = route.params
    const { conversationId, member1, member2 } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [receiverData, setReceiverData] = useState({});
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState<string>('')
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        if (member1._id == userData._id) {
            setReceiverData(member2)
        } else {
            setReceiverData(member1)
        }
        getMessageOfConversation(conversationId)
    }, [])

    const getMessageOfConversation = async (conversationId: string) => {
        setIsLoading(true);
        try {
            const res = await getMessageOfConversationApi(conversationId);
            const { data } = res;
            setMessage(data)
        } catch (error) {
            alert(error)
        }
        setIsLoading(false);
    }
    const renderMessageItem = ({ item, index }) => {
        const shouldDisplayCreatedAt = shouldDisplayDay(index);
        return (
            <View>
                <View style={{ alignItems: "center" }}>
                    {shouldDisplayCreatedAt &&
                        <Text style={{
                            textAlign: "center",
                            color: "white",
                            backgroundColor: "#adacaa",
                            borderRadius: 50,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            fontSize: 13
                        }}>
                            {createdAtDay(item?.createdAt)}
                        </Text>}
                </View>
                <TouchableOpacity onPress={() => console.log(item?.sender._id)} style={[styles.messageContainer,
                {
                    alignSelf: item?.sender._id === userData._id ? 'flex-end' : 'flex-start',
                    backgroundColor: item?.sender._id == userData._id ? "#DCF8C6" : '#fff'
                },

                ]}>
                    <Text style={styles.messageText}>{item?.text}</Text>
                    <Text style={styles.time}>
                        {timeInMessage(item?.createdAt)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

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
            return 'Hôm nay'
        } else if (momentCreatedAt.isSameOrAfter(yesterday)) {
            return 'Hôm qua'
        } else {
            return momentCreatedAt.format('DD/MM/YYYY');
        }
    }
    const timeInMessage = (createdAt) => {
        return moment(createdAt).format('HH:mm');
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            sendMessage('image', result.assets[0].uri);
        }
    };

    // const sendMessage = async () => {
    //     setNewMessage(newMessage.trim())
    //     if (newMessage.trim() === '') return
    //     try {
    //         const newMessageObject = {
    //             conversationId: conversationId,
    //             text: newMessage,
    //             sender: userData._id
    //         };
    //         console.log("newMessageObject", newMessageObject)
    //         const messageResponse = await sendMessageAPI(newMessageObject)
    //         console.log(messageResponse.status)
    //         const { data } = messageResponse
    //         console.log(data)
    //         setMessage((prevMessages) => [...prevMessages, data])
    //         setNewMessage('');
    //     } catch (err) {
    //         alert(err)
    //     }
    // }
    const sendMessage = async (messageType, messageContent) => {
        setNewMessage(newMessage.trim());
        if (newMessage.trim() === '' && !messageContent) return;

        try {
            const newMessageObject = {
                conversationId: conversationId,
                text: newMessage,
                sender: userData._id,
                imageUrl: selectedImage
            };

            if (messageType === "image" && messageContent) {
                newMessageObject.imageUrl = messageContent;
            }

            console.log("newMessageObject", newMessageObject);
            const messageResponse = await sendMessageAPI(newMessageObject);
            console.log(messageResponse.status);
            const { data } = messageResponse;
            console.log(data);
            setMessage([...message, newMessageObject]);
            setNewMessage('');

            // Nếu bạn muốn đặt lại hình ảnh đã chọn sau khi gửi
            setSelectedImage("");
        } catch (err) {
            alert(err);
        }
    }
    // const handleSend = async (messageType, imageUri) => {
    //     setNewMessage(newMessage.trim())
    //     try {
    //         // const formData = new FormData();
    //         // formData.append("sender", userData._id);
    //         // formData.append("conversationId", conversationId);
    //         const newMessageObject = {
    //             conversationId: conversationId,
    //             text: newMessage,
    //             sender: userData._id
    //         };
    //         //if the message type id image or a normal text
    //         if (messageType === "image") {
    //             newMessageObject.append("messageType", "image");
    //             formData.append("imageFile", {
    //                 uri: imageUri,
    //                 name: "image.jpg",
    //                 type: "image/jpeg",
    //             });
    //         } else {
    //             formData.append("text", newMessage);
    //         }

    //         const messageResponse = await sendMessageAPI(newMessageObject)

    //         if (messageResponse.status === 200) {
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
                    <Text style={{ fontSize: 25, fontWeight: "bold" }} >{receiverData?.username}</Text>
                </View>
            </View>
            <View style={styles.flatListContainer}>
                <FlatList
                    onRefresh={() => getMessageOfConversation(conversationId)}
                    refreshing={isLoading}
                    data={message}
                    renderItem={(item) => renderMessageItem(item)}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={pickImage} style={styles.icon}>
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
                    onPress={() => sendMessage}
                >
                    <MaterialIcons name="send" size={30} color="blue" />
                </TouchableOpacity>
            </View>
            <StatusBar style="dark" />
        </View>
    )
}

export default MessageScreen

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
    flatListContainer: {
        justifyContent: "flex-end",
        padding: 10,
        backgroundColor: "#f3f4fb",
        flex: 1,
    },
    messageContainer: {
        padding: 8,
        borderRadius: 10,
        margin: 10,
        maxWidth: '70%',
        borderColor: "#d4d5d6",
        borderWidth: 1
    },
    messageText: {
        fontSize: 15,
    },
    time: {
        fontSize: 11,
        color: "gray",
        textAlign: "left"
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        borderTopColor: '#dedede',
        borderTopWidth: 1,
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
        padding: 10
    },
});