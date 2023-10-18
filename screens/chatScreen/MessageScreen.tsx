import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { BASE_URL, getMessageOfConversationApi, sendMessageAPI, updateConversation } from '../../services/ChatService';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    Modal,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Button,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera'
import axios from 'axios';

const MessageScreen = ({ route, navigation }: any) => {
    const { userData, conversationId, members, conversationImage, isGroup } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //
    const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState<string>('')
    const [newGroupAvatar, setNewGroupAvatar] = useState<string>('');
    //
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState<string>('');
    //
    const [selectedMessage, setSelectedMessage] = useState([])
    const [isModalImageVisible, setModalImageVisible] = useState(false);
    const [image, setImage] = useState<string>('');

    //
    const [camera, setCamera] = useState(null)
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);
    //
    const scrollViewRef = useRef(null);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
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
    useEffect(() => {
        getMessageOfConversation(conversationId);
    }, []);

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
    // const permisionFunction = async () => {
    //     // here is how you can get the camera permission
    //     const cameraPermission = await ImagePicker.useCameraPermissions();

    //     setCameraPermission(cameraPermission.status === 'granted');

    //     const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    //     console.log(imagePermission.status);

    //     setGalleryPermission(imagePermission.status === 'granted');

    //     if (
    //         imagePermission.status !== 'granted' &&
    //         cameraPermission.status !== 'granted'
    //     ) {
    //         alert('Permission for media access needed.');
    //     }
    // };
    // useEffect(() => {
    //     permisionFunction();
    // }, []);



    const pickImageForMessage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            sendMessage("image", result.assets[0].uri)
            console.log(result.assets[0].uri)
        }
    }
    const sendMessage = async (type, imageUri) => {
        setNewMessage(newMessage.trim());
        if (!imageUri && newMessage.trim() === '') return
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("sender", userData._id);
        if (type === "image") {
            formData.append("type", "image");
            formData.append("image", {
                uri: imageUri,
                name: "image.jpg",
                type: "image/jpeg",
            });
        } else {
            formData.append("type", "text");
            formData.append("text", newMessage);
        }

        try {
            await sendMessageAPI(formData);
            getMessageOfConversation(conversationId);
            setImage('');
            setNewMessage('');
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
        if (!newGroupAvatar && newGroupName.trim() === '') return
        try {
            await updateConversation(conversationId, { groupName: newGroupName, groupAvatar: newGroupAvatar })
            getMessageOfConversation(conversationId);
            setNewGroupName('');
            setNewGroupAvatar('')
        } catch (err) {
            alert(err);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", height: 60, flexDirection: "row", left: 10, gap: 15 }}>
                <MaterialIcons
                    onPress={() => navigation.goBack()}
                    name="arrow-back-ios"
                    size={24}
                    color="black"
                />

                <TouchableOpacity
                    onPress={() => {
                        {
                            isGroup &&
                                setModalUpdateVisible(!isModalUpdateVisible)
                        }
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}>
                    <View style={{ left: 10, bottom: 5 }}>
                        {members.length > 1
                            ? (
                                <View style={styles.conversationImage}>
                                    <View style={{
                                        flex: 1,
                                        padding: 1,
                                    }}>
                                        <Image
                                            source={{ uri: userData.profilePicture }}
                                            style={{
                                                width: 40, height: 40,
                                                resizeMode: "cover",
                                                borderRadius: 30,
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
                                            source={{ uri: conversationImage[0] }}
                                            style={{
                                                right: 15, bottom: 10,
                                                width: 40, height: 40,
                                                resizeMode: "cover",
                                                borderRadius: 30,
                                                borderColor: "#f3f4fb",
                                                borderWidth: 2
                                            }}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.conversationImage}>
                                    <View style={{
                                        flex: 1,
                                        padding: 1,
                                    }}>
                                        <Image
                                            source={{ uri: conversationImage[0] }}
                                            style={{
                                                width: "100%", height: "100%", borderRadius: 30
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        }
                    </View>

                    <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                        {members.map(member => member.username).join(', ')}

                    </Text>
                    {isGroup &&
                        <MaterialIcons name="edit" size={20} color="gray" />
                    }
                </TouchableOpacity>

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
            <View
                style={{
                    justifyContent: "center",
                    backgroundColor: "#f0f5f4",
                    flexDirection: "row"
                }}
            >
            </View>
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
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={isModalUpdateVisible}
                onRequestClose={() => setModalUpdateVisible(!isModalUpdateVisible)}
            >
                <View style={styles.modalUpdateBackground}>
                    <TouchableOpacity style={styles.touchable} onPress={() => setModalUpdateVisible(!isModalUpdateVisible)}>
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
                                }}
                            >
                                <Text style={{ color: "#0a83f5", fontSize: 20 }}>Huỷ</Text>
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
                            {members.length > 1
                                && (
                                    <View style={styles.conversationImage}>
                                        <View style={{
                                            flex: 1,
                                            padding: 1,
                                        }}>
                                            <Image
                                                source={{ uri: userData.profilePicture }}
                                                style={{
                                                    right: 20, top: 20,
                                                    width: 70, height: 70,
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
                                                source={{ uri: conversationImage[0] }}
                                                style={{
                                                    left: 10, bottom: 30,
                                                    width: 70, height: 70,
                                                    resizeMode: "cover",
                                                    borderRadius: 50,
                                                    borderColor: "#f3f4fb",
                                                    borderWidth: 2
                                                }}
                                            />
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                        <View style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <TextInput
                                style={{
                                    backgroundColor: "#f3f4fb",
                                    height: 50,
                                    width: "85%",
                                    fontSize: 20,
                                    borderRadius: 10,
                                    padding: 10,
                                    marginVertical: 50,

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


                        {/* <Image style={{ height: 350, width: 350 }} source={{ uri: selectedMessage.image }} /> */}
                    </View>
                </View>
            </Modal >
            <StatusBar style="dark" backgroundColor='white' />
        </View >
    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        top: getStatusBarHeight() - 4,
        flex: 1,
        margin: null,
        backgroundColor: 'white'
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
        alignItems: 'center',
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
        backgroundColor: "#f3f4fb",
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
        backgroundColor: "#f3f4fb",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 50,
        borderTopColor: '#dedede',
        borderTopWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 15,
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