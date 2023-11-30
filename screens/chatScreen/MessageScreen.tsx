import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createNewGroupChat, getMessageOfConversationApi, sendMessageAPI, updateConversation } from '../../services/ChatService';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    Modal,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Dimensions,
    StatusBar,
    PermissionsAndroid,
    SafeAreaView,
    ImageBackground,
    ScrollView,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { blankAvatar } from '../friendScreen/FriendScreen';
import { formatDay, formatTime } from '../../component/formatTime';
import { socket } from "../../utils/socket";
import Header from '../../component/messages/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import COLORS from '../../assets/conts/color';
import ModalImageShow from '../../component/messages/modal/ModalImageShow';
import ModalUpdateGroup from '../../component/messages/modal/UpdateGroup';
import { FlashList } from '@shopify/flash-list'
import { showToast } from '../../component/showToast';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function getRandomColor() {
    const colors = [
        '#3498db',
        '#e74c3c',
        '#2ecc71',
        '#f39c12',
        '#1abc9c',
        '#9b59b6',
        '#34495e',
        '#d35400',
        '#c0392b',
        '#27ae60',
        '#e67e22',
        '#8e44ad',
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
const randomColor = getRandomColor();
const MessageScreen = ({ route, navigation }: any) => {
    const {
        userData,
        conversationId,
        members,
        memberAvatar,
        isGroup,
        groupName,
        groupAvatar
    } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [press, setPress] = useState<boolean>(false)
    //
    const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [senderName, setSenderName] = useState('John Doe');
    //

    const [renderedMessages, setRenderedMessages] = useState(50);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    //
    const [selectedMessage, setSelectedMessage] = useState([])
    const [isModalImageVisible, setModalImageVisible] = useState(false);

    const [image, setImage] = useState<string>('');
    //
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const reversedMessage = message.slice().reverse();
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [endOfMessages, setEndOfMessages] = useState(false);

    const [loading, setLoading] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);

    const socketRef = useRef();

    const openCamera = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const result = await launchCamera(options)
            setImage(result.assets[0].uri)
        }
    }
    //


    //
    const scrollViewRef = useRef(null);

    // const scrollToBottom = () => {
    //     if (scrollViewRef.current) {
    //         scrollViewRef.current.scrollToEnd({ animated: true })
    //     }
    // }
    // const handleContentSizeChange = () => {
    //     scrollToBottom();
    // }

    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    useEffect(() => {
        // scrollToBottom()
        getMessageOfConversation(conversationId);
    }, []);

    useEffect(() => {
        socket?.on("getMessage", (data) => {
            setArrivalMessage(data)
        })
    }, [socket])

    useEffect(() => {
        if (arrivalMessage && conversationId == arrivalMessage.conversationId) {
            setMessage([...message, arrivalMessage])
        }
    }, [arrivalMessage])



    let lastDisplayedDate = null;
    const shouldDisplayDay = (reversedIndex: number) => {
        if (reversedIndex === 0) {
            return true;
        }

        const currentMessage = message[reversedIndex];
        const currentMessageCreatedAt = moment(currentMessage.createdAt);
        const currentDay = currentMessageCreatedAt.startOf('day');

        const previousMessage = message[reversedIndex - 1];
        const previousMessageCreatedAt = moment(previousMessage.createdAt);
        const previousDay = previousMessageCreatedAt.startOf('day');

        return !currentDay.isSame(previousDay, 'day');
    };

    const getMessageOfConversation = async (conversationId: string) => {
        setIsLoading(true);
        try {
            const res = await getMessageOfConversationApi(conversationId);
            const { data } = res
            setMessage(data);
        } catch (error) {
            alert("Lỗi" + error);
        }
        setIsLoading(false);
    };
    const pickImageForMessage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri)

        }
    }
    console.log(newMessage)

    // Gửi tin nhắn
    const sendMessage = async () => {
        setNewMessage(newMessage.trim());
        const newMessageObject = {
            _id: `${Date.now()}-${userData?._id}`,
            conversationId: conversationId,
            text: newMessage,
            createdAt: new Date(),
            image: image,
            sender: {
                _id: userData?._id,
                profilePicture: userData?.profilePicture,
                username: userData?.username,
            },
            members: members,
        };

        setMessage((prevMessages) => prevMessages.concat(newMessageObject));
        setNewMessage('');
        setImage('');
        setLoading(true)

        if (!image && newMessage.trim() === '') {
            setLoading(false)
            return
        }

        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("sender", userData._id);
        formData.append("text", newMessage);
        image &&
            formData.append("image", {
                uri: image,
                name: "image.jpg",
                type: "image/jpeg",
            })
        try {
            const { data, status } = await sendMessageAPI(formData);
            console.log(status)
            const socketMessage = {
                _id: data._id,
                conversationId: data.conversationId,
                text: data.text,
                createdAt: data.createdAt,
                image: data.image,
                sender: {
                    _id: userData._id,
                    profilePicture: userData.profilePicture,
                    username: userData.username
                },
                members: members,
            };
            // setMessage((prevMessages) => prevMessages.concat(socketMessage));
            if (status === 200) {
                const updatedMessages = message.map(msg =>
                    msg._id === newMessageObject._id ? { ...data, _id: newMessageObject._id } : msg
                );

                setMessage(updatedMessages);
                socket?.emit("sendMessage", socketMessage);
                console.log("Gửi thành công");
                setSendSuccess(true);
            } else {
                showToast("error", "Có lỗi xảy ra khi gửi tin nhắn");
            }
            Keyboard.dismiss();

        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    }

    const handleEndReached = async () => {
        if (!isLoadingMore && !endOfMessages) {
            setIsLoadingMore(true);
            await fetchMoreMessages();
            setIsLoadingMore(false);
        }
    };

    const fetchMoreMessages = async () => {
        // Implement your logic to fetch more messages
        // Example: Fetch additional 20 messages
        const additionalMessages = message.slice(0, 20);

        // If there are no more messages to fetch, set endOfMessages to true
        if (additionalMessages.length === 0) {
            setEndOfMessages(true);
        }

        // Concatenate the new messages with the existing ones
        setMessage([...additionalMessages, ...message]);
    };

    const renderMessageItem = ({ item, index }: any) => {
        const reversedIndex = message.length - 1 - index;
        const shouldDisplayCreatedAt = shouldDisplayDay(reversedIndex);
        const senderInfo = members.find((member: { _id: any; }) => member._id === item?.sender?._id);
        const senderName = senderInfo ? senderInfo.username : null;
        const isUserDataSender = item?.sender?._id === userData._id;
        const isReceiver = item?.sender?._id != userData._id


        let showSenderName = false
        let senderNameColor

        if (reversedIndex === 0 || item?.sender?._id !== message[reversedIndex - 1].sender?._id) {
            showSenderName = true;
            senderNameColor = getRandomColor();
        }
        return (
            <View key={index} style={{ flex: 1 }}>
                {shouldDisplayCreatedAt && (
                    <View style={{ marginVertical: 40, alignItems: "center", justifyContent: "center", height: 20, width: "20%", marginHorizontal: '40%', borderRadius: 20, backgroundColor: "rgba(250,250,250,0.5)" }}>
                        <Text style={{
                            textAlign: "center",
                            color: "#666666",
                            fontWeight: '500',
                            fontSize: 13,
                        }}>
                            {formatDay(item?.createdAt)}
                        </Text>
                    </View>
                )}
                {showSenderName && isReceiver && (
                    <View>
                        {isGroup ? (
                            <View style={{ height: 30, justifyContent: "flex-end" }}>
                                <Text style={{ fontSize: 14, color: `${senderNameColor}`, marginLeft: 50 }}>{senderName}</Text>
                            </View>
                        ) : null}
                        <View>
                            <Image source={item?.sender?.profilePicture ? { uri: item?.sender?.profilePicture } : blankAvatar}
                                style={{
                                    width: 25, height: 25, borderRadius: 50, position: "absolute", bottom: -35, left: 10
                                }}
                            />
                        </View>
                    </View>
                )}
                <Pressable key={index}
                    onPress={() => {
                        setSelectedMessage(item);
                        item?.image && setModalImageVisible(!isModalImageVisible);
                        console.log(item)
                    }}
                    style={[isUserDataSender
                        ? {
                            alignSelf: "flex-end",
                            backgroundColor: "#d7f7ef",
                            borderRadius: 15,
                            margin: 10,
                            marginHorizontal: 10,
                            marginVertical: 2,
                            maxWidth: '80%',
                            borderWidth: 1,
                            padding: item?.image ? 0 : 5,
                            flexDirection: 'column',
                            alignItems: "flex-end",
                            borderColor: "#eeeeee",
                        }
                        : {
                            alignSelf: "flex-start",
                            backgroundColor: "#FAFAFA",
                            borderRadius: 15,
                            maxWidth: "70%",
                            marginLeft: 40,
                            padding: item?.image ? 0 : 5,
                            flexDirection: 'column',
                            marginVertical: 2,
                        }
                    ]}>
                    {item?.text ? (
                        <View style={{ alignItems: "flex-start" }} >
                            {item?.image && (
                                <Image
                                    defaultSource={{ uri: item?.image }}
                                    resizeMethod='resize'
                                    source={{ uri: item?.image }}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 10
                                    }}
                                />
                            )}
                            <Text style={{ color: '#212121', fontSize: 17, maxWidth: "100%", paddingHorizontal: item?.image ? 0 : 10, }}>
                                {item?.text}
                            </Text>
                        </View>
                    ) : (
                        <Image
                            source={{ uri: item?.image }}
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 10
                            }}
                        />
                    )}
                    <View style={item?.image ? {
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        borderRadius: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        flexDirection: "row",
                        paddingHorizontal: 5
                    } : {
                        flexDirection: "row",
                        marginHorizontal: 5,
                    }}>
                        <Text
                            style={{
                                textAlign: isUserDataSender ? "right" : "left",
                                fontSize: 10,
                                color: item?.image ? "#FAFAFA" : "#666666",
                                paddingVertical: 1,
                            }}
                        >
                            {formatTime(item?.createdAt)}
                        </Text>
                        {reversedIndex === message.length - 1 && isUserDataSender
                            ?
                            loading
                                ? <ActivityIndicator size={'small'} />
                                : (sendSuccess && <Ionicons name="ios-checkmark-done-outline" size={15} color={item?.image ? "#FAFAFA" : "#666666"} />)
                            : null
                        }
                    </View>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            {/* Header */}
            <View style={{ width: "100%", height: Platform.OS === 'ios' ? "11%" : "8%", backgroundColor: COLORS.main_color }}>
                <Header
                    navigation={navigation}
                    setModalUpdateVisible={setModalUpdateVisible}
                    isModalUpdateVisible={isModalUpdateVisible}
                    isGroup={isGroup}
                    groupAvatar={groupAvatar}
                    members={members}
                    userData={userData}
                    groupName={groupName}
                    memberAvatar={memberAvatar}
                />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ImageBackground
                    source={require("../../assets/img/background-chat.png")}
                    style={{ flex: 1 }}>

                    <FlashList
                        inverted
                        onEndReached={handleEndReached}
                        estimatedItemSize={20}
                        onEndReachedThreshold={0.5}
                        renderItem={renderMessageItem}
                        data={reversedMessage}
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: "center", justifyContent: "center", width: windowWidth - 100, height: 270, marginHorizontal: 50, marginTop: 70, borderRadius: 30 }}>
                                <Image style={{ width: 200, height: 200 }}
                                    source={require("../../assets/img/chat.gif")} />
                            </View>
                        )}
                        ListHeaderComponent={() => (
                            <View style={{ height: 20 }} />
                        )}
                    />
                    {/* soạn tin nhắn, gửi ảnh */}
                    <SafeAreaView style={styles.footer}>
                        {image
                            ? <View
                                style={{
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    gap: 10,
                                    flex: 1
                                }}
                            >
                                <Image source={{ uri: image }} style={{ width: 100, height: 100, }} />
                                <Feather name="x-circle"
                                    size={30}
                                    onPress={() => { setImage(``) }}
                                    color="#a3a3a3"
                                    style={{}} />
                            </View>
                            : <TextInput
                                value={newMessage}
                                multiline={true}
                                placeholderTextColor="#888"
                                onChangeText={(value) => {
                                    setNewMessage(value);
                                }}
                                onFocus={() => setPress(true)}
                                onBlur={() => setPress(false)}
                                style={styles.messageInput}
                                placeholder="Tin nhắn"
                            />
                        }

                        {(newMessage || image) ?
                            <TouchableOpacity onPress={sendMessage}
                                style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", marginRight: 15 }}  >
                                <FontAwesome name="send" size={30} color="#FF9134" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={pickImageForMessage}
                                style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", marginRight: 15 }} >
                                <Image source={require('../../assets/img/uploadPhoto.png')}
                                    style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>
                        }
                    </SafeAreaView>
                </ImageBackground>
            </KeyboardAvoidingView>

            {/* Show Image */}
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={isModalImageVisible}
                onRequestClose={() => setModalImageVisible(!isModalImageVisible)}
            >
                <View style={styles.modalImageBackground}>
                    <TouchableOpacity style={styles.touchable} onPress={() => setModalImageVisible(!isModalImageVisible)}>
                        {/* Phần xung quanh modal để bắt sự kiện bấm ra ngoài */}
                        <MaterialIcons name="cancel" size={30} color={'#FF9134'}
                            onPress={() => setModalImageVisible(!isModalImageVisible)}
                            style={{
                                position: "absolute", left: 30, top: 100
                            }}
                        />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: `${selectedMessage.image}` }}
                        style={{
                            width: 400,
                            height: 400
                        }}
                    />
                </View>
            </Modal>

            {/* edit group name, group avatar */}
            <ModalUpdateGroup isModalUpdateVisible={isModalUpdateVisible}
                setModalUpdateVisible={setModalUpdateVisible}
                groupName={groupName}
                groupAvatar={groupAvatar}
                conversationId={conversationId}
                members={members}
                memberAvatar={memberAvatar}
                userData />
        </View >
    );
};


const styles = StyleSheet.create({

    header: {
        gap: 10,
        padding: 10,
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
    },
    conversationImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginRight: 10,
    },

    messageText: {
        fontSize: 16,
    },
    timeText: {
        fontSize: 11,

        textAlign: "left",
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        maxHeight: 150,
        gap: 10,
        backgroundColor: "#FAFAFA",
    },
    messageInput: {
        flex: 1,
        fontSize: 18,
        maxHeight: 150,
        marginHorizontal: 10,
        minHeight: 50,
    },
    icon: {
        padding: 10,
        flexDirection: "row",
        gap: 15,

    },

    modalImageBackground: {
        flex: 1,
        backgroundColor: '#f3f4fd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        borderRadius: 10,
        alignItems: 'center',
    },
    touchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalUpdateBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',

    },
    modalUpdate: {
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: "white",
        width: '95%',
        height: "40%",
        top: 50

    },
});

export default MessageScreen;
