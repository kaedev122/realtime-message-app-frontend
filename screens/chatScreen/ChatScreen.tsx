import { StyleSheet, Text, View, TextInput, Dimensions, FlatList, TouchableOpacity, Image, Modal, StatusBar, ScrollView, Platform } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { Entypo, EvilIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { createNewGroupChat, createNewChat, getAllConversationApi, updateWatched } from '../../services/ChatService'
import { getUserDataByIdApi } from '../../services/UserService'
import { getAllFriendApi } from '../../services/FriendService';
import Checkbox from 'expo-checkbox';
import { showToast } from '../../component/showToast';
import Toast from 'react-native-toast-message';
import { blankAvatar } from '../friendScreen/FriendScreen';
import Header from '../../component/conversations/Header';
import { formatDay, formatTimeLatestMsg } from '../../component/formatTime';
import { socket } from "../../utils/socket";
import { useUnreadMessages, UnreadMessagesProvider } from '../../component/UnreadMessages ';
import OnlineUser from '../../component/conversations/OnlineUser';
import ModalNewGroupChat from '../../component/conversations/ModalNewGroupChat';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChatScreen = ({ navigation, route }: any) => {
    const { userData } = route.params
    const [isLoadingConversation, setIsLoadingConversation] = useState<boolean>(false);
    const [isLoadingFriend, setIsLoadingFriend] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const numSelected = selectedIds.filter(index => index != userData._id).length
    const [conversation, setConversation] = useState([]);
    const [textSearch, setTextSearch] = useState<string>("");
    const [dataSearch, setDataSearch] = useState([]);
    //
    const [friendSearch, setFriendSearch] = useState<string>("");
    const [friends, setFriends] = useState([]);
    const [dataFriendSearch, setDataFriendSearch] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([])
    const { setUnreadMessages } = useUnreadMessages()
    const isWatched = conversation.filter(
        conversation => conversation.watched.includes(userData._id)
    );
    const countNotWatched = conversation.length - isWatched.length;
    useEffect(() => {
        setUnreadMessages(countNotWatched);
    }, [countNotWatched]);

    useEffect(() => {
        getConversation();
        getAllFriend();
    }, []);

    useEffect(() => {
        socket?.on("getUsersOnline", (data: React.SetStateAction<never[]>) => {
            console.log("-----------Online users--------------", data)
            setOnlineUsers(data)
        })
    }, [socket]);

    useEffect(() => {
        handleSearch(textSearch);
    }, [textSearch]);

    useEffect(() => {
        handleSearchFriend(friendSearch);
    }, [friendSearch]);

    useFocusEffect(
        useCallback(() => {
            getConversation();
        }, [])
    );

    const resetFriendSelection = () => {
        const updatedFriends = friends.map((friend) => ({
            ...friend,
            isSelected: false,
        }));
        setFriends(updatedFriends);
        setSelectedIds([]);
    };

    const getConversation = async () => {
        setIsLoadingConversation(true);
        try {
            const listData = await getAllConversationApi();
            const { data } = listData;
            // const sortMsg = data.sort((
            //     a: { createdAt: string | number | Date; },
            //     b: { createdAt: string | number | Date; }
            // ) => {
            //     const dateA = new Date(a?.createdAt);
            //     const dateB = new Date(b?.createdAt);
            //     return dateB - dateA;
            // });
            // console.log(sortMsg)
            // console.log(sortedLatestMessage)

            // const sortedLatestMessage = data.sort((
            //     a: { lastestMessage: { createdAt: string | number | Date; }; },
            //     b: { lastestMessage: { createdAt: string | number | Date; }; }
            // ) => {
            //     const dateA = new Date(a?.lastestMessage?.createdAt);
            //     const dateB = new Date(b?.lastestMessage?.createdAt);
            //     return dateB - dateA;
            // });
            // console.log(sortedLatestMessage)
            data.sort((a, b) => {
                const dateA = a.lastestMessage ? new Date(a.lastestMessage.createdAt) : new Date(a.createdAt);
                const dateB = b.lastestMessage ? new Date(b.lastestMessage.createdAt) : new Date(b.createdAt);

                return dateB - dateA;
            });
            setConversation(data);
        } catch (error: any) {
            showToast("error", "Không thể tải cuộc trò chuyện")
        }
        setIsLoadingConversation(false);
        getAllFriend();
    };

    const newGroupChat = async () => {
        if (numSelected > 1) {
            try {
                const res = await createNewGroupChat({
                    "members": selectedIds
                })
                console.log(res)
                getConversation(),
                    setSelectedIds([]),
                    setModalVisible(!isModalVisible),
                    showToast("success", "Thành công")
                resetFriendSelection();

            } catch (error) {
                alert(error)
            }
        }
    }


    const handleSearch = (textSearch: string) => {
        const result = conversation.filter((item) => {
            const memberNames = item?.members.map((member: { username: any; }) => member.username);
            const groupNames = item?.groupName
            const combinedNames = memberNames.join(' ').toLowerCase() + (groupNames ? ` ${groupNames.toLowerCase()}` : '');
            return combinedNames.includes(textSearch.toLowerCase());
        });
        setDataSearch(result);
    };

    const handleSearchFriend = (textSearch: string) => {
        const lowerTextSearch = textSearch.toLowerCase();
        const result = friends.filter((item) => item?.username.toLowerCase().includes(lowerTextSearch));
        setDataFriendSearch(result);
    };

    const getAllFriend = async () => {
        setIsLoadingFriend(true);
        try {
            const listFriend = await getAllFriendApi();
            const { data } = listFriend;
            setFriends(data.friendList);
        } catch (error: any) {
            alert(error.response);
        }
        setIsLoadingFriend(false);
    };

    const isSeen = async (conversationId: string) => {
        try {
            const res = await updateWatched(conversationId)
        } catch (error) {

        }
    }


    const renderConversationItem = ({ item }: any) => {
        const members = item.members.filter((member: { _id: any; }) => member._id != userData._id);
        const numMembers = members.length
        const memberAvatar = members.map((member: { profilePicture: any; }) => member.profilePicture)
        const isGroup = item?.group
        const isWatched = item?.watched.filter((item: any) => item == userData._id) == userData._id
        return (
            <TouchableOpacity
                style={styles.conversation}
                onPress={() => {
                    isSeen(item?._id);
                    navigation.navigate('MessageScreen', {
                        userData: userData,
                        conversationId: item?._id,
                        members: members,
                        isGroup: isGroup,
                        memberAvatar: memberAvatar.map((image: any) => image),
                        groupName: item?.groupName,
                        groupAvatar: item?.groupAvatar
                    })
                }}
            >

                {/* Avatar */}
                {item?.groupAvatar &&
                    (
                        <View style={styles.conversationImage}>
                            <Image
                                source={{ uri: item?.groupAvatar }}
                                style={{
                                    width: "100%", height: "100%", borderRadius: 30
                                }}
                            />
                        </View>
                    )
                    ||
                    (
                        (numMembers > 1)
                            ? (
                                <View style={styles.conversationImage}>
                                    <View style={{
                                        flex: 1,
                                        padding: 1,
                                    }}>
                                        <Image
                                            source={userData.profilePicture ? { uri: userData.profilePicture } : blankAvatar}
                                            style={{
                                                right: 0, top: 20,
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
                                            source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
                                            style={{
                                                right: 10, bottom: 0,
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

                {/* Body */}
                <View style={{ flexDirection: "column", justifyContent: "center", gap: 5, flex: 1 }}>
                    {/* Tên kênh */}
                    <View style={{}}>
                        {item?.groupName
                            ? (
                                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: isWatched ? "500" : "bold" }}>
                                    {item?.groupName}
                                </Text>
                            ) : (
                                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: isWatched ? "500" : "bold" }}>
                                    {members.map((member: { username: any; }) => member.username).join(', ')}
                                </Text>
                            )
                        }
                    </View>
                    {/* Thông tin */}
                    <View style={{ flexDirection: "row", gap: 5, alignSelf: "flex-start", width: "100%" }}>
                        {/* Tin nhắn cuối */}
                        <View style={{ maxWidth: "80%" }}>
                            {item?.lastestMessage?.image ? (
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 15,
                                        color: isWatched ? "gray" : "black",
                                        fontWeight: isWatched ? "normal" : "bold",
                                    }}>
                                    {(item.lastestMessage?.sender?._id === userData._id) && item?.lastestMessage
                                        ? "Bạn đã gửi một ảnh."
                                        : `${item?.lastestMessage?.sender?.username} đã gửi một ảnh.`}
                                </Text>
                            ) : (
                                <Text numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                    style={{
                                        fontSize: 15,
                                        color: isWatched ? "gray" : "black",
                                        fontWeight: isWatched ? "normal" : "bold",

                                    }}>
                                    {item?.lastestMessage?.sender?._id === userData._id
                                        ? isGroup
                                            ? `Bạn: ${item?.lastestMessage?.text}`
                                            : item?.lastestMessage?.text
                                        : isGroup
                                            ? `${item?.lastestMessage?.sender?.username}: ${item?.lastestMessage?.text}`
                                            : item?.lastestMessage?.text}
                                </Text>
                            )}
                            <View style={{ height: 2, width: 2, backgroundColor: "gray", position: "absolute", right: -4, top: 10, borderRadius: 10 }}></View>
                        </View>
                        {/* Thời gian */}
                        <Text style={{ fontSize: 13, color: "gray" }}>
                            {formatTimeLatestMsg(item?.lastestMessage?.createdAt)}
                        </Text>
                    </View>

                </View>
                {!isWatched ?
                    <View style={{ height: 13, width: 13, backgroundColor: "#FF9134", borderRadius: 20, marginRight: 10 }}>
                    </View> : null}
            </TouchableOpacity>
        );
    }


    return (
        <View style={{ height: windowHeight - 80, width: windowWidth, backgroundColor: "#FFFFFF" }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={"#FFFFFF"} />
            {/* Header */}
            <View style={{ width: "100%", height: "11%" }}>
                <Header setModalVisible={setModalVisible} isModalVisible={isModalVisible} />
            </View>

            {/* List Conversations */}
            <View style={{ flex: 1, }}>
                <FlatList
                    onRefresh={getConversation}
                    refreshing={isLoadingConversation}
                    data={textSearch ? dataSearch : conversation}
                    renderItem={(item) => renderConversationItem(item)}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: "center", justifyContent: "center", width: "100%", height: 400 }}>
                            <Image style={{ width: "70%", height: "70%", marginBottom: 20 }} source={require("../../assets/img/thought-bubble.png")} />
                            <Text numberOfLines={2} style={{ position: "absolute", top: 130, fontSize: 25, textAlign: "center", width: "50%" }}>Chưa có cuộc trò chuyện nào!</Text>
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <View style={{ alignItems: "center", marginTop: 10 }}>
                            {/* Search */}
                            <View style={{
                                width: "90%", height: 40, flexDirection: "row", borderRadius: 10,
                                justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4FD"
                            }}>
                                <EvilIcons name="search" size={26} color="#888" />
                                <TextInput
                                    value={textSearch}
                                    placeholder="Tìm kiếm"
                                    placeholderTextColor={"#888"}
                                    style={{ flex: 1, height: "100%", fontSize: 18 }}
                                    onChangeText={(value) => {
                                        setTextSearch(value);
                                    }}
                                />
                                {textSearch && (
                                    <MaterialIcons name="cancel" size={25} color={"gray"}
                                        onPress={() => setTextSearch("")}
                                        style={{ position: "absolute", right: 10 }}
                                    />
                                )}
                            </View>
                            {/* Online users */}
                            <View style={{ width: "100%" }}>
                                <OnlineUser friends={friends}
                                    onlineUsers={onlineUsers}
                                    userData={userData}
                                    navigation={navigation}
                                    isSeen={isSeen}
                                />
                            </View>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <View style={{ height: Platform.OS === 'android' ? 30 : null }}></View>
                    )}
                />
            </View>

            {/* New Group Chat */}
            <ModalNewGroupChat
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                getConversation={getConversation}
                getAllFriend={getAllFriend}
                userData={userData}
                resetFriendSelection={resetFriendSelection}
                newGroupChat={newGroupChat}
                setSelectedIds={setSelectedIds}
                friends={friends}
                setFriends={setFriends}
                setFriendSearch={setFriendSearch}
                numSelected={numSelected}
                friendSearch={friendSearch}
                dataFriendSearch={dataFriendSearch}
                isLoadingFriend={isLoadingFriend}
            />
            <Toast />
        </View>
    );
}

export default ChatScreen

const styles = StyleSheet.create({

    imageContainer: {
        flex: 1,
        padding: 2,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",

    },
    conversationImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        flexDirection: 'row',
        marginHorizontal: 5
    },
    container: {
        height: windowHeight,
        backgroundColor: "white",
        width: windowWidth
    },
    header: {
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
    },
    searchInput: {
        backgroundColor: "#ededed",
        borderRadius: 10,
        padding: 5,
        width: "100%",
        marginVertical: 5,
        fontSize: 20,
    },
    body: {
        marginTop: 10,
        width: "100%",
        height: "100%",
    },
    conversation: {
        flexDirection: "row",
        alignItems: "center",
        height: 70,
        width: windowWidth,
        marginBottom: 0,
        padding: 10,
        marginVertical: 5,
        gap: 10
    },

    modal: {


    },
})