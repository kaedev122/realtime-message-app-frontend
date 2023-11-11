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
    ImageBackground
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { blankAvatar } from '../friendScreen/FriendScreen';
import { formatDay, formatTime } from '../../component/formatTime';
import { socket } from "../../utils/socket";
import Header from '../../component/messages/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import COLORS from '../../assets/conts/color';
import ModalImageShow from '../../component/messages/modal/ModalImageShow';
import ModalUpdateGroup from '../../component/messages/modal/UpdateGroup';

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
    const [message, setMessage] = useState([]);
    const [renderedMessages, setRenderedMessages] = useState(50);
    const [newMessage, setNewMessage] = useState<string>('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    //
    const [selectedMessage, setSelectedMessage] = useState([])
    const [isModalImageVisible, setModalImageVisible] = useState(false);

    const [image, setImage] = useState<string>('');


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

    const scrollViewRef = useRef(null);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    useEffect(() => {
        scrollToBottom()
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
    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true })
        }
    }
    const handleContentSizeChange = () => {
        scrollToBottom();
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

    const getMessageOfConversation = async (conversationId: string) => {
        setIsLoading(true);
        try {
            const res = await getMessageOfConversationApi(conversationId);
            const { data } = res
            console.log("-------", data)
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
    const sendMessage = async () => {
        setNewMessage(newMessage.trim());
        if (!image && newMessage.trim() === '') return
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("sender", userData._id);
        formData.append("text", newMessage);
        image && formData.append("image", {
            uri: image,
            name: "image.jpg",
            type: "image/jpeg",
        })
        try {
            const { data, status } = await sendMessageAPI(formData);
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
            if (status == 200) {
                socket?.emit("sendMessage", socketMessage);
                setNewMessage('');
                setImage("")
            }
            Keyboard.dismiss

        } catch (err) {
            alert(err);
        }
    }

    const renderMessageItem = ({ item, index }) => {
        const shouldDisplayCreatedAt = shouldDisplayDay(index);
        const senderInfo = members.find(member => member._id === item?.sender?._id);
        const senderName = senderInfo ? senderInfo.username : null;
        const isUserDataSender = item?.sender?._id === userData._id;
        const isReceiver = item?.sender?._id != userData._id


        let showSenderName = false
        let senderNameColor
        if (index === 0 || item?.sender?._id !== message[index - 1].sender?._id) {
            showSenderName = true
            senderNameColor = getRandomColor()
        }
        return (
            <View style={{ flex: 1 }}>
                {shouldDisplayCreatedAt &&
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
                }
                {showSenderName && isReceiver && (
                    <View>
                        {isGroup
                            ? <View style={{ height: 30, justifyContent: "flex-end" }}>
                                <Text style={{ fontSize: 14, color: `${senderNameColor}`, marginLeft: 50 }}>{senderName}</Text>
                            </View>
                            : null
                        }
                        <View>
                            <Image source={item?.sender?.profilePicture ? { uri: item?.sender?.profilePicture } : blankAvatar}
                                style={{
                                    width: 25, height: 25, borderRadius: 50, position: "absolute", bottom: -35, left: 10
                                }}
                            />
                        </View>
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => {
                        setSelectedMessage(item);
                        item?.image && setModalImageVisible(!isModalImageVisible);
                        console.log(senderName)
                    }}

                    style={{
                        borderRadius: 15,
                        marginHorizontal: 7,
                        marginVertical: 2,
                        maxWidth: '80%',
                        borderWidth: 1,
                        padding: item?.image ? 0 : 5,
                        flexDirection: 'column',
                        alignItems: "flex-end",
                        borderColor: "#eeeeee",
                        alignSelf: isUserDataSender ? 'flex-end' : 'flex-start',
                        backgroundColor: isUserDataSender ? '#d7f7ef' : '#FAFAFA',
                        marginLeft: isUserDataSender ? 0 : 40,

                    }}
                >
                    {item?.text ? (
                        <View style={{ alignItems: "flex-start" }} >
                            {item?.image && (
                                <Image
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
                    } : {}}>
                        <Text
                            style={{
                                textAlign: isUserDataSender ? "right" : "left",
                                fontSize: 10,
                                color: item?.image ? "#FAFAFA" : "#666666",
                                paddingHorizontal: 5,
                                paddingVertical: 1
                            }}
                        >
                            {formatTime(item?.createdAt)}
                        </Text>
                    </View>
                </TouchableOpacity>


            </View>
        );
    };
    const handleTopReached = () => {
        setRenderedMessages(renderedMessages + 50);
    };

    return (

        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <StatusBar barStyle={'light-content'} backgroundColor={COLORS.main_color} />
            {/* Header */}
            <View style={{ width: "100%", height: Platform.OS === 'ios' ? "10%" : "8%", backgroundColor: COLORS.main_color }}>
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
                    <FlatList
                        ref={scrollViewRef}
                        contentContainerStyle={{ flexGrow: 1 }}
                        onContentSizeChange={handleContentSizeChange}
                        initialNumToRender={renderedMessages}
                        onEndReached={handleTopReached}
                        onEndReachedThreshold={0.1}
                        onRefresh={() => getMessageOfConversation(conversationId)}
                        refreshing={isLoading}
                        renderItem={item => renderMessageItem(item)}
                        data={message}
                        ListFooterComponent={() => (<View style={{ height: 30 }}></View>)}
                    // inverte
                    />
                </ImageBackground>

                {/* soạn tin nhắn, gửi ảnh */}
                <View
                    style={{
                        justifyContent: "center",
                        backgroundColor: "#f0f5f4",
                        flexDirection: "row"
                    }}
                >
                    {image && (
                        <Image source={{ uri: image }} style={{ width: 100, height: 100, }} />
                    )}
                    {image &&
                        <Feather name="x-circle"
                            size={30}
                            onPress={() => { setImage(``) }}
                            color="#a3a3a3"
                            style={{ left: 20, top: 10 }} />
                    }
                </View>
                <SafeAreaView style={styles.footer}>
                    {/* {!press &&
                        <TouchableOpacity onPress={pickImageForMessage} >
                            <Image source={require('../../assets/img/camera.png')} style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>
                    } */}

                    <TextInput
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
        minHeight: 55,
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
        backgroundColor: 'rgba(255, 255, 255, 0.99)', // Màu đen với độ mờ 0.5 (50% mờ)
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
