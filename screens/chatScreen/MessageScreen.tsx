import React, { useState, useEffect, useRef } from 'react';
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
    StatusBar
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { io } from "socket.io-client";
import { blankAvatar } from '../friendScreen/FriendScreen';
import Header from '../../component/Header';
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
    //
    const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState<string>(groupName)
    const [newGroupAvatar, setNewGroupAvatar] = useState<string>(groupAvatar);
    //
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    //
    const [selectedMessage, setSelectedMessage] = useState([])
    const [isModalImageVisible, setModalImageVisible] = useState(false);
    const [image, setImage] = useState<string>('');

    //
    const scrollViewRef = useRef(null);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const [isModalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        scrollToBottom()
        getMessageOfConversation(conversationId);
    }, []);

    useEffect(() => {
        socket.current = io("https://realtime-chat-app-server-88535f0d324c.herokuapp.com");
        socket.current.emit("addUser", userData._id);
        console.log("========================")
    }, []);

    useEffect(() => {
        socket.current.on("getMessage", (data) => {
            setArrivalMessage(data)
            console.log("-------------------------")
        })
    }, [])

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
    const formatDay = (createdAt) => {
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
    }
    const formatTime = (createdAt) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(createdAt).toLocaleString("en-US", options);
    }

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
            const { data } = await sendMessageAPI(formData);
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

            socket.current.emit("sendMessage", socketMessage);
            setNewMessage('');
            setImage("")
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
                            {formatDay(item?.createdAt)}
                        </Text>}
                </View>
                {showSenderName && (
                    <Text style={senderNameStyle}>{senderName}</Text>
                )}
                {item?.image ?
                    (<TouchableOpacity
                        onPress={() => {
                            setSelectedMessage(item)
                            setModalImageVisible(!isModalImageVisible)
                            // setImage(`${item?.image}`)
                        }}
                        style={[
                            styles.messageContainer,
                            {
                                alignSelf: isUserDataSender ? 'flex-end' : 'flex-start',
                                backgroundColor: isUserDataSender ? "#DCF8C6" : '#fff',
                            },
                        ]}
                    >

                        {item?.text ? (
                            item?.image ? (
                                <View>
                                    <Image source={{ uri: `${item?.image}` }} style={{ width: 200, height: 200 }} />
                                    <Text style={styles.messageText}>{item?.text}</Text>
                                </View>
                            ) : (
                                <Text style={styles.messageText}>{item?.text}</Text>
                            )

                        ) : (
                            <Image source={{ uri: `${item?.image}` }} style={{ width: 200, height: 200 }} />
                        )}
                        <Text style={styles.timeText}>
                            {formatTime(item?.createdAt)}
                        </Text>
                    </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.messageContainer,
                                {
                                    alignSelf: isUserDataSender ? 'flex-end' : 'flex-start',
                                    backgroundColor: isUserDataSender ? "#DCF8C6" : '#fff',
                                },
                            ]}
                        >
                            {item?.text ? (
                                item?.image ? (
                                    <View>
                                        <Image source={{ uri: `${item?.image}` }} style={{ width: 200, height: 200 }} />
                                        <Text style={styles.messageText}>{item?.text}</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.messageText}>{item?.text}</Text>
                                )

                            ) : (
                                <Image source={{ uri: `${item?.image}` }} style={{ width: 200, height: 200 }} />
                            )}
                            <Text style={styles.timeText}>
                                {formatTime(item?.createdAt)}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            </View >
        );
    };

    const permisionFunction = async () => {
        // here is how you can get the camera permission
        const cameraPermission = await ImagePicker.useCameraPermissions();

        setCameraPermission(cameraPermission.status === 'granted');

        const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
        console.log(imagePermission.status);

        setGalleryPermission(imagePermission.status === 'granted');

        if (
            imagePermission.status !== 'granted' &&
            cameraPermission.status !== 'granted'
        ) {
            alert('Permission for media access needed.');
        }
    };
    useEffect(() => {
        permisionFunction();
    }, []);


    return (
        <View style={styles.container}>
            <Header>
                <View style={styles.header}>
                    <MaterialIcons
                        onPress={() => navigation.goBack()}
                        name="arrow-back-ios"
                        size={24}
                        color="black"
                    />

                    <TouchableOpacity
                        onPress={() => {
                            {
                                isGroup && setModalUpdateVisible(!isModalUpdateVisible)
                            }
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10
                        }}>

                        <View >
                            {groupAvatar && (
                                <View style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 50,
                                    marginRight: 10,
                                }}>
                                    <View style={{
                                        flex: 1,
                                        padding: 1,
                                    }}>
                                        <Image
                                            source={{ uri: groupAvatar }}
                                            style={{
                                                width: 50, height: 50, borderRadius: 30
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                                ||
                                (
                                    (members.length > 1)
                                        ? (
                                            <View style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 50,
                                                marginRight: 10,
                                            }}>
                                                <View style={{
                                                    flex: 1,
                                                    padding: 1,
                                                }}>
                                                    <Image
                                                        source={{ uri: userData.profilePicture }}
                                                        style={{
                                                            right: 10, top: 15,
                                                            width: 40, height: 40,
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
                                                            width: 40, height: 40,
                                                            resizeMode: "cover",
                                                            borderRadius: 50,
                                                            borderColor: "#f3f4fb",
                                                            borderWidth: 2
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 50,
                                                marginRight: 10,
                                            }}>
                                                <View style={{
                                                    flex: 1,
                                                    padding: 1,
                                                }}>
                                                    <Image
                                                        source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}

                                                        style={{
                                                            width: "100%", height: "100%", borderRadius: 30
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        )
                                )
                            }

                        </View>

                        {groupName &&
                            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                                {groupName}
                            </Text>
                            ||
                            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                                {members.map(member => member.username).join(', ')}
                            </Text>
                        }
                        {isGroup &&
                            <MaterialIcons name="edit" size={20} color="gray" />
                        }
                    </TouchableOpacity>

                </View>
            </Header>
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
            <View
                style={{
                    justifyContent: "center",
                    backgroundColor: "#f0f5f4",
                    flexDirection: "row"
                }}
            >
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.footer}>

                    <TextInput
                        value={newMessage}
                        multiline={true}
                        placeholderTextColor="#888"
                        onChangeText={(value) => {
                            setNewMessage(value);
                        }}
                        style={styles.messageInput}
                        placeholder="Nhập tin nhắn ..."
                    />

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginHorizontal: 8,
                        }}
                    >
                        <TouchableOpacity

                            style={styles.iconPhoto}>
                        </TouchableOpacity>
                    </View>
                    <FontAwesome onPress={pickImageForMessage} name="picture-o" size={30} color="gray" />

                    <TouchableOpacity
                        onPress={sendMessage}
                        style={styles.sendBtn}
                    >
                        <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
            {/* see picture */}
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
                    </TouchableOpacity>
                    <View style={styles.modalImage}>
                        <Image style={{ height: 350, width: 350 }} source={{ uri: selectedMessage.image }} />
                    </View>
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
                                                    source={{ uri: userData.profilePicture }}
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
            <StatusBar barStyle={'dark-content'} backgroundColor="white" />
        </View >
    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
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
    flatListContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    messageContainer: {
        padding: 8,
        borderRadius: 10,
        marginHorizontal: 7,
        marginVertical: 2,
        maxWidth: '70%',
        borderColor: "#d4d5d6",
        borderWidth: 1,
    },
    senderName: {
        fontSize: 14,
        color: "gray",
        marginLeft: 10
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
        alignItems: 'center',
        borderTopWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 15,
        shadowOpacity: 0.3,
        shadowColor: '#00000',
        shadowOffset: { width: 0, height: 20 },
        width: "100%",
        elevation: 10,
        maxHeight: 150,
        minHeight: 80,
        backgroundColor: "white",
        borderTopColor: "#eee"
    },
    createdAtText: {
        textAlign: "center",
        color: "white",
        backgroundColor: "#adacaa",
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 13,
        marginVertical: 20,
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 20,
        paddingHorizontal: 10,
        fontSize: 15,
        maxHeight: 150,
        minHeight: 40,
    },
    sendBtn: {
        backgroundColor: "#007bff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginLeft: 15
    },
    iconPhoto: {
        paddingHorizontal: 10,
        flex: 1,
        padding: 10,
        position: "absolute",
        right: 5,
        width: "15%"

    },
    modalImageBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Màu đen với độ mờ 0.5 (50% mờ)
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