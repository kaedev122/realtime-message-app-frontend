import React, { useState, useEffect } from 'react'
import { getMessageOfConversationApi, sendMessageAPI } from '../../services/ChatService'
import { Image, StyleSheet, Text, View, TextInput, Platform, SafeAreaView, Dimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MessageBody } from '../../services/interfaces/IMessage';
import { MaterialIcons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getUserDataByIdApi } from '../../services/UserService'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height

const MessageScreen = ({ route, navigation }: any) => {
    const { userData } = route.params
    const { conversationId, member1, member2 } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [receiverData, setReceiverData] = useState({});
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState<string>('')

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
            console.log(data)
            setMessage(data)
        } catch (error) {
            alert(error)
        }
        setIsLoading(false);
    }


    const renderMessageItem = ({ item }) => {
        return (
            <TouchableOpacity style={[styles.messageContainer,
            {
                alignSelf: item?.sender._id == userData._id ? 'flex-end' : 'flex-start',
                backgroundColor: item?.sender._id == userData._id ? '#DCF8C6' : '#fff'
            },

            ]}>
                <Text style={styles.messageText}>{item?.text}</Text>
                <Text style={{ fontSize: 13, color: "gray" }}>{getDiff(item?.createdAt)}</Text>
            </TouchableOpacity>
        );
    }

    const sendMessage = async () => {
        setNewMessage(newMessage.trim())
        if (newMessage.trim() === '') return;
        try {
            const newMessageObject = {
                conversationId: conversationId,
                text: newMessage,
                sender: userData._id
            };
            console.log("newMessageObject", newMessageObject)
            const messageResponse = await sendMessageAPI(newMessageObject)
            const { data } = messageResponse
            console.log(data)
            setMessage([...message, newMessageObject]);
            setNewMessage('');
        } catch (err) {
            alert(err)
        }
    }

	const getDiff = (time) => {
		return moment(time).fromNow();
	}

    return (
        // <KeyboardAwareScrollView
        //     enableOnAndroid={true}
        //     enableAutomaticScroll={(Platform.OS === 'ios')}
        //     style={styles.container}>
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
        // </KeyboardAwareScrollView>

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
        padding: 5,
        margin: 4,
        borderRadius: 8,
        maxWidth: '70%',
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