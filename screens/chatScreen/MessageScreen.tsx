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
    SafeAreaView
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    console.log(conversationId)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [press, setPress] = useState<boolean>(false)
    //
    const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState<string>(groupName)
    const [newGroupAvatar, setNewGroupAvatar] = useState<string>(groupAvatar);
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
    const pickImageForUpdate = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            console.log(result.assets[0].uri)
            setNewGroupAvatar(result.assets[0].uri)
        }
    }
    const updateGroupChat = async () => {
        setNewGroupName(newGroupName.trim());
        const formData = new FormData()
        formData.append("groupName", newGroupName)
        formData.append("groupAvatar", {
            uri: newGroupAvatar,
            name: "image.jpg",
            type: "image/jpeg",
        })
        try {
            const res = await updateConversation(conversationId, formData)
            console.log(res)
            setNewGroupAvatar(newGroupAvatar)
            setNewGroupName(newGroupName)
            setModalUpdateVisible(!isModalUpdateVisible)
            getMessageOfConversation(conversationId)
        } catch (error) {

        }
    }
    const renderMessageItem = ({ item, index }) => {
        const shouldDisplayCreatedAt = shouldDisplayDay(index);
        const senderInfo = members.find(member => member._id === item?.sender?._id);
        const senderName = senderInfo ? senderInfo.username : null;
        const isUserDataSender = item?.sender?._id === userData._id;
        const isReceiver = item?.sender?._id != userData._id


        let showSenderName = false;
        if (index === 0 || item?.sender?._id !== message[index - 1].sender?._id) {
            showSenderName = true;
        }
        return (
            <View>
                <View style={{ alignItems: "center" }}>
                    {shouldDisplayCreatedAt &&
                        <Text style={styles.createdAtText}>
                            {formatDay(item?.createdAt)}
                        </Text>}
                </View>

                {showSenderName && isReceiver && (
                    <View style={{ height: 30, justifyContent: "flex-end" }}>
                        <Text style={{ fontSize: 14, color: "lightgray", marginLeft: 50, }}>{senderName}</Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => {
                        setSelectedMessage(item);
                        item?.image && setModalImageVisible(!isModalImageVisible);
                        console.log(item)
                    }}

                    style={[
                        styles.messageContainer,
                        {
                            padding: item?.image ? 0 : 7,
                            alignSelf: isUserDataSender ? 'flex-end' : 'flex-start',
                            backgroundColor: isUserDataSender ? '#FF9134' : '#F5F5F5',
                            marginLeft: isUserDataSender ? 0 : 50,

                        },
                    ]}
                >
                    {item?.text ? (
                        <View>
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
                            <Text style={{
                                color: isUserDataSender ? '#FFFFFF' : '#262626',
                                fontSize: 17,
                                padding: 2
                            }}>{item?.text}</Text>
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

                    <Text
                        style={[{
                            textAlign: isUserDataSender ? "right" : "left",
                            fontSize: 11,
                            color: (item?.image && !item?.text || isUserDataSender) ? "white" : "gray",
                            paddingHorizontal: 3
                        }, item?.image && !item?.text && {
                            position: "absolute",
                            right: 5,
                            bottom: 0,
                            height: 20,
                            paddingHorizontal: 10,
                            backgroundColor: "#736a616b",
                            overflow: 'hidden',
                            borderRadius: 10
                        }]}
                    >
                        {formatTime(item?.createdAt)}
                    </Text>
                </TouchableOpacity>
                {showSenderName && isReceiver && (
                    <View style={{ height: 30 }}>
                        <Image source={item?.sender?.profilePicture ? { uri: item?.sender?.profilePicture } : blankAvatar}
                            style={{
                                width: 30, height: 30, borderRadius: 50, position: "absolute", bottom: 30, left: 10
                            }}
                        />
                    </View>
                )}
            </View>
        );
    };
    const handleTopReached = () => {
        setRenderedMessages(renderedMessages + 50);
    };

    return (

        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <StatusBar barStyle={'dark-content'} backgroundColor="white" />
            {/* Header */}
            <View style={{ height: "10%", width: "100%" }}>
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
                <View style={{ flex: 1 }}>
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
                </View>

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
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={isModalUpdateVisible}
                onRequestClose={() => setModalUpdateVisible(!isModalUpdateVisible)}
            >
                <View style={styles.modalUpdateBackground}>
                    <TouchableOpacity style={styles.touchable}
                        onPress={() => {
                            setModalUpdateVisible(!isModalUpdateVisible)
                            setNewGroupName("")
                            setNewGroupAvatar("")
                        }}>
                    </TouchableOpacity>
                    <View style={styles.modalUpdate}>
                        <View
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                position: "absolute"
                            }}>

                            <TouchableOpacity
                                style={{
                                    width: 50, height: 50, left: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => {
                                    setModalUpdateVisible(!isModalUpdateVisible)
                                    setNewGroupName('')
                                    setNewGroupAvatar('')
                                }}
                            >
                                <Text style={{ color: "#0a83f5", fontSize: 20 }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 50, height: 50, right: 12,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={updateGroupChat}
                            >
                                <Text style={{ color: "#0a83f5", fontSize: 20, fontWeight: "bold" }}>Xong</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginVertical: 20 }}>
                            {newGroupAvatar ?
                                (

                                    <View style={styles.conversationImage}>

                                        <Image
                                            source={{ uri: newGroupAvatar || groupAvatar }}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: 50
                                            }}
                                        />
                                    </View>
                                )
                                :
                                (
                                    (members.length > 1)
                                    && (
                                        <View style={styles.conversationImage}>
                                            <View style={{
                                                flex: 1,
                                                padding: 1,
                                            }}>
                                                <Image
                                                    source={userData.profilePicture ? { uri: userData.profilePicture } : blankAvatar}
                                                    style={{
                                                        right: 10, top: 20,
                                                        width: 50, height: 50,
                                                        resizeMode: "cover",
                                                        borderRadius: 50,
                                                        borderColor: "#f3f4fb",
                                                        borderWidth: 2
                                                    }}
                                                />
                                            </View>


                                            <View style={{
                                                flex: 1,
                                                padding: 1,
                                            }}>
                                                <Image
                                                    source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
                                                    style={{
                                                        left: 10, bottom: 25,
                                                        width: 50, height: 50,
                                                        resizeMode: "cover",
                                                        borderRadius: 50,
                                                        borderColor: "#f3f4fb",
                                                        borderWidth: 2
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )
                                )
                            }

                            {
                                newGroupAvatar &&
                                <Feather name="x-circle" size={24}
                                    onPress={() => setNewGroupAvatar("")}
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        backgroundColor: "#f3f4fa",
                                        borderRadius: 50,
                                    }}
                                />
                            }
                        </View>
                        <View style={{
                            width: "85%",
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 20
                        }}>
                            <TextInput
                                style={{
                                    backgroundColor: "#f3f4fb",
                                    height: 50,
                                    width: "100%",
                                    fontSize: 20,
                                    borderRadius: 10,
                                    padding: 10,

                                }}

                                placeholder='Đặt tên đoạn chat'
                                placeholderTextColor="#888"
                                value={newGroupName}
                                onChangeText={(value) => {
                                    setNewGroupName(value)
                                }}
                            />
                            {
                                newGroupName &&

                                <MaterialIcons name="cancel" size={25}
                                    onPress={() => setNewGroupName("")}
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                    }}
                                />
                            }

                        </View>
                        <View
                            style={{
                                height: 50,
                                width: 50,
                                backgroundColor: "#f3f4fb",
                                borderRadius: 30,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <FontAwesome onPress={pickImageForUpdate} name="picture-o" size={24} color="black" />
                        </View>
                        <Text>Tải lên</Text>
                    </View>
                </View>
            </Modal >
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

    messageContainer: {
        borderRadius: 10,
        marginHorizontal: 7,
        marginVertical: 2,
        maxWidth: '70%',
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
        backgroundColor: "#e8e8e8",


    },
    createdAtText: {
        textAlign: "center",
        color: "#adacaa",
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 13,
        marginVertical: 20,
    },
    messageInput: {
        flex: 1,
        backgroundColor: "#e8e8e8",
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
