import { StyleSheet, Text, View, TextInput, Dimensions, FlatList, TouchableOpacity, Image, StatusBar, Platform, SafeAreaView, Pressable, Modal } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react'
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { createNewGroupChat, createNewChat, getAllConversationApi, updateWatched, addGroupMember } from '../../services/ChatService'
import { getAllFriendApi } from '../../services/FriendService';
import { showToast } from '../../component/showToast';
import Toast from 'react-native-toast-message';
import { blankAvatar } from '../friendScreen/FriendScreen';
import Header from '../../component/conversations/Header';
import { formatTimeLatestMsg } from '../../component/formatTime';
import { socket } from "../../utils/socket";
import { useUnreadMessages } from '../../contexts/UnreadMessages ';
import ModalNewGroupChat from '../../component/conversations/ModalNewGroupChat';
import COLORS from '../../assets/conts/color';
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
    const [isModalEdit, setModalEdit] = useState(false);
    const [idGroupEdit, setIdGroupEdit] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([])
    const { setUnreadMessages } = useUnreadMessages()
    const seen = conversation.map(conversation => conversation.watched)
    const duplicateIDs = seen.flatMap(subArray => {
        const ids = subArray.map(item => item._id);
        const duplicate = ids.filter(id => id === userData._id);
        return duplicate;
    });

    const isWatched = conversation
        .map(conversation => conversation.watched)
        .filter(info => info.some(obj => obj?._id === userData._id))
    const countNotWatched = conversation.length - isWatched.length;
    useEffect(() => {
        setUnreadMessages(countNotWatched);
    }, [countNotWatched]);

    useEffect(() => {
        socket?.on("getIncomeConversation", (data) => {
            setConversation((prevState) => {
                const newState = prevState.map(item => {
                    if (item._id === data._id) {
                        item.lastestMessage = data.lastestMessage;
                    }
                    return item;
                });
                const updatedWatched = data.watched || [];
                newState.forEach(item => {
                    const foundWatched = updatedWatched.find(watchedItem => watchedItem._id === item._id);
                    item.watched = foundWatched || item.watched;
                });

                newState.sort((a, b) => {
                    const dateA = new Date(a.lastestMessage?.createdAt);
                    const dateB = new Date(b.lastestMessage?.createdAt);
                    return dateB - dateA;
                });

                return newState;
            });
        });
    }, [socket]);

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
        // getAllFriend();
    };

    const newGroupChat = async () => {
        if (numSelected > 1) {
            try {
                const res = await createNewGroupChat({
                    "members": selectedIds
                })
                getConversation(),
                    setSelectedIds([]),
                    setModalVisible(!isModalVisible),
                    showToast("success", "Thành công")
                resetFriendSelection();

            } catch (error) {
                console.log("error creating conversation", error)
            }
        }
    }
    const handleAddGroupMember = async () => {
        try {
            const res = await addGroupMember(idGroupEdit, {
                "members": selectedIds
            });
            getConversation();
            setSelectedIds([]);
            setIdGroupEdit('')
            setModalEdit(false)
            setModalVisible(false);
            showToast("success", "Thành công");
            resetFriendSelection();
        } catch (error) {
            console.log("error add members to group", error);
        }
    };


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
        setIsLoadingConversation(true);
        try {
            const listFriend = await getAllFriendApi();
            const { data } = listFriend;
            setFriends(data.friendList);
        } catch (error) {
            console.log("error", error)
        }
        setIsLoadingConversation(false);
    };

    const isSeen = async (conversationId: string) => {
        try {
            const res = await updateWatched(conversationId)
        } catch (error) {
            console.log("error", error)
        }
    }

    const getImageStyle = (index) => {
        switch (index) {

            case 2:
                return { height: 19, width: 19, borderRadius: 10, resizeMode: "cover", borderColor: "#FFFFFF", borderWidth: 2, right: 7 };
            case 1:
                return { height: 19, width: 19, borderRadius: 10, resizeMode: "cover", borderColor: "#FFFFFF", borderWidth: 2, right: 7 };
            case 0:
                return { height: 19, width: 19, borderRadius: 10, resizeMode: "cover", borderColor: "#FFFFFF", borderWidth: 2 };
            default:
                return { height: 19, width: 19, borderRadius: 10, resizeMode: "cover", borderColor: "#FFFFFF", borderWidth: 2 };
        }
    };

    const renderConversationItem = ({ item }: any) => {
        const members = item?.members?.filter((member: { _id: any; }) => member?._id != userData._id)
        const memberId = members.map((member: { _id: any; }) => member?._id)
        const isOnline = memberId.some((memberId) => onlineUsers?.includes(memberId))
        const memberNames = members.map((member: { username: any }) => member?.username)
        const memberAvatar = members.map((member: { profilePicture: any }) => member?.profilePicture)
        const isGroup = item?.group
        const memberSeenInfo = item?.watched.filter((info: any) => info?._id !== userData._id).filter(info => info?._id !== item?.lastestMessage?.sender?._id)
        const memberSeenAvatar = memberSeenInfo.map((user: { profilePicture: any; }) => user?.profilePicture)
        const isWatched = item?.watched.filter((info: any) => info?._id).map(info => info._id).includes(userData._id)

        return (
            <Pressable
                style={styles.conversation}
                onPress={() => {
                    console.log(item?._id)
                    isSeen(item?._id)
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
                onLongPress={() => {
                    isGroup && setModalEdit(true)
                    isGroup && setIdGroupEdit(item?._id)
                }
                }
            >

                {/* Avatar */}
                {
                    item?.groupAvatar &&
                    (
                        <View style={styles.conversationImage}>
                            <Image
                                source={{ uri: item?.groupAvatar }}
                                style={{
                                    width: "100%", height: "100%", borderRadius: 50
                                }}
                            />
                            {isOnline &&
                                <View style={{
                                    height: 18, width: 18, backgroundColor: "#54cc0e", borderRadius: 10, borderWidth: 3,
                                    position: "absolute", bottom: 0, right: 0, borderColor: "#FFFFFF"
                                }}></View>}
                        </View>
                    )
                    ||
                    (
                        (members.length > 1)
                            ? (
                                <View style={styles.conversationImage}>

                                    <Image
                                        source={userData.profilePicture ? { uri: userData.profilePicture } : blankAvatar}
                                        style={{
                                            right: 0, top: 20,
                                            width: 35, height: 35,
                                            resizeMode: "cover",
                                            borderRadius: 50,
                                            borderColor: "#f3f4fb",
                                            borderWidth: 2
                                        }}
                                    />
                                    <Image
                                        source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
                                        style={{
                                            right: 15, top: 0,
                                            width: 35, height: 35,
                                            resizeMode: "cover",
                                            borderRadius: 50,
                                            borderColor: "#f3f4fb",
                                            borderWidth: 2
                                        }}
                                    />
                                    {isOnline &&
                                        <View style={{
                                            height: 18, width: 18, backgroundColor: "#54cc0e", borderRadius: 10, borderWidth: 3,
                                            position: "absolute", bottom: 0, right: 0, borderColor: "#FFFFFF"
                                        }}></View>}
                                </View>
                            ) : (
                                <View style={styles.conversationImage}>

                                    <Image
                                        source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
                                        style={{
                                            width: "100%", height: "100%", borderRadius: 50
                                        }}
                                    />
                                    {isOnline &&
                                        <View style={{
                                            height: 18, width: 18, backgroundColor: "#54cc0e", borderRadius: 10, borderWidth: 3,
                                            position: "absolute", bottom: 0, right: 0, borderColor: "#FFFFFF"
                                        }}></View>}
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
                                    {memberNames.join(', ')}
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
                                            ? item?.lastestMessage
                                                ? `${item?.lastestMessage?.sender?.username}: ${item?.lastestMessage?.text}`
                                                : ''
                                            : item?.lastestMessage?.text}
                                </Text>
                            )}
                        </View>
                        {/* Thời gian */}
                        {item?.lastestMessage
                            ? <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }}>
                                <View style={{ height: 2, width: 2, backgroundColor: "gray", borderRadius: 10 }}></View>
                                <Text style={{ fontSize: 13, color: "gray" }}>
                                    {formatTimeLatestMsg(item?.lastestMessage?.createdAt)}
                                </Text>
                            </View>
                            : null
                        }
                    </View>
                </View>
                {
                    isWatched
                        ? <View style={{ marginRight: 10, flexDirection: "row", alignItems: "flex-end" }}>
                            {memberSeenAvatar.map((avatar, index) => (
                                <Image
                                    key={index}
                                    style={getImageStyle(index)}
                                    source={avatar ? { uri: avatar } : blankAvatar}
                                />
                            ))}
                        </View>
                        : <View style={{ height: 13, width: 13, backgroundColor: COLORS.main_color, borderRadius: 20, marginRight: 10 }}>
                        </View>

                }
            </Pressable >
        );
    }

    return (
        <View style={{ height: windowHeight - 80, width: windowWidth, backgroundColor: "#FFFFFF" }}>
            {/* Header */}
            <StatusBar barStyle={'light-content'} backgroundColor={COLORS.main_color} />
            <SafeAreaView style={{ width: "100%", height: Platform.OS === 'ios' ? "12%" : "9%", backgroundColor: COLORS.main_color }}>
                <Header
                    textSearch={textSearch}
                    setTextSearch={setTextSearch}
                    setModalVisible={setModalVisible}
                    isModalVisible={isModalVisible} />
            </SafeAreaView>

            {/* List Conversations */}
            <View style={{ flex: 1, }}>
                <FlashList
                    estimatedItemSize={20}
                    onRefresh={getConversation}
                    refreshing={isLoadingConversation}
                    data={textSearch ? dataSearch : conversation}
                    renderItem={(item) => renderConversationItem(item)}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: "center", justifyContent: "center", width: "100%", height: 400 }}>
                            <Image style={{ width: "60%", height: "60%", marginBottom: 20 }}
                                source={require("../../assets/img/speech-bubble.gif")} />
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <View style={{ alignItems: "center", marginTop: 10 }}>
                            {/* Search */}

                            {/* Online users */}
                            {/* <View style={{ width: "100%" }}>
                                <OnlineUser
                                    friends={friends}
                                    onlineUsers={onlineUsers}
                                    userData={userData}
                                    navigation={navigation}
                                    isSeen={isSeen}
                                />
                            </View> */}
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
                isModalEdit={isModalEdit}
                setModalEdit={setModalEdit}
                handleAddGroupMember={handleAddGroupMember}
                idGroupEdit={idGroupEdit}
                setIdGroupEdit={setIdGroupEdit}
            />
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={isModalEdit}
                onRequestClose={() => setModalEdit(!isModalEdit)}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isModalEdit ? "rgba(0,0,0,0.5)" : undefined }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }} onPress={() => setModalEdit(false)}>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}
                        style={{ backgroundColor: COLORS.main_color, padding: 5, borderRadius: 20 }}>
                        <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
                            Thêm thành viên
                        </Text>
                    </TouchableOpacity>
                </View>


            </Modal>

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
        width: 55,
        height: 55,
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