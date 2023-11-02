import { StyleSheet, Text, View, TextInput, Dimensions, FlatList, TouchableOpacity, Image, Modal, StatusBar } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { createNewGroupChat, createNewChat, getAllConversationApi, updateWatched } from '../../services/ChatService'
import { getUserDataByIdApi } from '../../services/UserService'
import { getAllFriendApi } from '../../services/FriendService';
import Checkbox from 'expo-checkbox';
import { showToast } from '../../component/showToast';
import Toast from 'react-native-toast-message';
import { blankAvatar } from '../friendScreen/FriendScreen';
import Header from '../../component/Header';
import { formatDay, formatTimeLatestMsg } from '../../component/formatTime';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenDimensions = Dimensions.get('screen');

const ChatScreen = ({ navigation, route }: any) => {
    const { userData } = route.params
    const [isLoadingConversation, setIsLoadingConversation] = useState<boolean>(false);
    const [isLoadingFriend, setIsLoadingFriend] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const numSelected = selectedIds.filter(index => index != userData._id).length
    const [conversation, setConversation] = useState([]);
    // console.log(conversation)
    const [textSearch, setTextSearch] = useState<string>("");
    const [dataSearch, setDataSearch] = useState([]);
    //
    const [friendSearch, setFriendSearch] = useState<string>("");
    const [friends, setFriends] = useState([]);
    const [dataFriendSearch, setDataFriendSearch] = useState([]);

    const [isModalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        getConversation();
        getAllFriend();
    }, []);

    useEffect(() => {
        handleSearch(textSearch);
    }, [textSearch]);

    useEffect(() => {
        handleSearchFriend(friendSearch);
    }, [friendSearch]);

    useFocusEffect(
        useCallback(() => {
            // Gọi hàm getConverStation ở đây
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
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.lastestMessage.createdAt);
                const dateB = new Date(b.lastestMessage.createdAt);
                return dateB - dateA;
            });
            console.log(sortedData)
            setConversation(sortedData);
        } catch (error: any) {
            alert(error.response);
        }
        setIsLoadingConversation(false);
        getAllFriend();
    };

    const newGroupChat = async () => {
        try {
            if (selectedIds.map(index => index != userData._id)) return

            const res = await createNewGroupChat({
                "members": selectedIds
            })
            getConversation(),
                setSelectedIds([]),
                setModalVisible(!isModalVisible),
                showToast("success", "Thành công")
            resetFriendSelection();

        } catch (error) {
            alert(error)
        }
    }


    const handleSearch = (textSearch: string) => {
        const result = conversation.filter((item) => {
            const memberNames = item?.members.map((member) => member.username);
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
    const isSeen = async (conversationId) => {
        try {
            const res = await updateWatched(conversationId)
        } catch (error) {

        }
    }

    const isWatched = conversation.filter(
        conversation => conversation.watched.includes(userData._id)
    )
    const countNotWatched = conversation.length - isWatched.length;
    console.log(countNotWatched)

    const renderConversationItem = ({ item }: any) => {
        const members = item.members.filter(member => member._id != userData._id);
        const numMembers = members.length
        const memberAvatar = members.map(member => member.profilePicture)
        const isGroup = item?.group
        const isWatched = item?.watched.filter(item => item == userData._id) == userData._id
        return (
            <TouchableOpacity
                style={styles.conversation}
                onPress={() => {
                    navigation.navigate('MessageScreen', {
                        userData: userData,
                        conversationId: item?._id,
                        members: members,
                        isGroup: isGroup,
                        memberAvatar: memberAvatar.map(image => image),
                        groupName: item?.groupName,
                        groupAvatar: item?.groupAvatar
                    })
                    isSeen(item?._id);
                }}>
                <View>
                    {item?.groupAvatar && (
                        <View style={styles.conversationImage}>
                            <View style={{
                                flex: 1,
                                padding: 1,
                            }}>
                                <Image
                                    source={{ uri: item?.groupAvatar }}
                                    style={{
                                        width: "100%", height: "100%", borderRadius: 30
                                    }}
                                />
                            </View>
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
                </View>

                <View style={{
                    borderBottomColor: "#ededed",
                    borderBottomWidth: 1,
                    width: "100%",
                    height: 60,
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <View>
                        {item?.groupName
                            ? (
                                <Text style={{ fontSize: 17, fontWeight: isWatched ? "normal" : "bold" }}>
                                    {item?.groupName}
                                </Text>
                            ) : (
                                <Text style={{ fontSize: 17, fontWeight: isWatched ? "normal" : "bold" }}>
                                    {members.map(member => member.username).join(', ')}
                                </Text>
                            )
                        }
                    </View>
                    <View style={{ flexDirection: "row", gap: 10, alignSelf: "flex-start" }}>
                        <View style={{ maxWidth: "65%" }}>
                            {item?.lastestMessage.image ? (
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: isWatched ? "gray" : "black",
                                        fontWeight: isWatched ? "normal" : "bold",
                                    }}>
                                    {item?.lastestMessage.sender._id === userData._id
                                        ? "Bạn đã gửi một ảnh."
                                        : `${item?.lastestMessage.sender.username} đã gửi một ảnh.`}
                                </Text>
                            ) : (
                                <Text numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                    style={{
                                        fontSize: 13,
                                        color: isWatched ? "gray" : "black",
                                        fontWeight: isWatched ? "normal" : "bold",

                                    }}>
                                    {item?.lastestMessage.sender._id === userData._id
                                        ? isGroup
                                            ? `Bạn: ${item?.lastestMessage.text}`
                                            : item?.lastestMessage.text
                                        : isGroup
                                            ? `${item?.lastestMessage.sender.username}: ${item?.lastestMessage.text}`
                                            : item?.lastestMessage.text}
                                </Text>
                            )}
                        </View>
                        <Text style={{ fontSize: 13, color: "gray" }}>
                            {formatTimeLatestMsg(item?.lastestMessage.createdAt)}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    const renderFriendItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    const updatedFriends = [...friends];
                    item.isSelected = !item.isSelected;
                    setFriends(updatedFriends);
                    if (item.isSelected && item?._id) {
                        setSelectedIds((prevSelectedIds) => {
                            const updatedIds = [...prevSelectedIds];
                            if (!updatedIds.includes(userData?._id)) {
                                updatedIds.push(userData?._id);
                            }
                            updatedIds.push(item?._id);
                            return updatedIds;
                        });
                    } else {
                        setSelectedIds((prevSelectedIds) =>
                            prevSelectedIds.filter((id) => id !== item._id)
                        );
                    }
                }}
                style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 22,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: 10,
                        alignItems: "center",
                        gap: 15
                    }}
                >
                    <Image
                        source={item?.profilePicture ? { uri: item?.profilePicture } : blankAvatar}
                        resizeMode="contain"
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                        }}
                    />

                    <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                        {item?.username}
                    </Text>
                    <Checkbox
                        color="#888"
                        onValueChange={() => {
                            item.isSelected = !item.isSelected;
                            const updatedFriends = [...friends];
                            setFriends(updatedFriends);

                            if (item.isSelected) {
                                setSelectedIds((prevSelectedIds) => {
                                    const updatedIds = [...prevSelectedIds];
                                    if (!updatedIds.includes(userData?._id)) {
                                        updatedIds.push(userData?._id);
                                    }
                                    updatedIds.push(item?._id);
                                    return updatedIds;
                                });
                            } else {
                                setSelectedIds((prevSelectedIds) =>
                                    prevSelectedIds.filter((id) => id !== item._id)
                                );
                            }
                        }}
                        value={item.isSelected}
                        style={{
                            position: "absolute",
                            right: 10,
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header>
                <Text style={{ fontSize: 20, fontWeight: "bold" }} >Đoạn chat </Text>
                <View style={styles.header}>
                    <View style={{ width: "80%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TextInput
                            value={textSearch}
                            placeholder="Tìm kiếm"
                            style={styles.searchInput}
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
                    <TouchableOpacity
                        style={{ width: 30, height: 30 }}
                        onPress={() => setModalVisible(!isModalVisible)}
                    >
                        <Entypo name="new-message" size={25} color="#FF9134" />
                    </TouchableOpacity>
                </View>
            </Header>

            <View style={styles.body}>

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
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(!isModalVisible)}
            >
                <View style={styles.newChatModal}>
                    <View style={styles.modal}>
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                left: 10,
                                top: 0,
                                padding: 10,
                            }}
                            onPress={() => {
                                setSelectedIds([]);
                                setFriendSearch("");
                                setModalVisible(!isModalVisible);
                                resetFriendSelection();
                            }}
                        >
                            <Text style={{ color: "#FF9134", fontSize: 20 }}>Hủy</Text>
                        </TouchableOpacity>
                        {(numSelected > 1)
                            ?
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 0,
                                    padding: 10,
                                }}
                                onPress={newGroupChat}
                            >
                                <Text style={{ color: "#FF9134", fontSize: 20, fontWeight: "bold" }}>Tạo</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 0,
                                    padding: 10,
                                }}
                                onPress={newGroupChat}
                            >
                                <Text style={{ color: "lightgray", fontSize: 20 }}>Tạo</Text>
                            </TouchableOpacity>
                        }
                        <View style={{
                            top: 50,
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#f3f4fa",
                        }}>
                            <Text style={{ fontSize: 17, color: "gray", padding: 10 }}>Đến:</Text>
                            <TextInput
                                multiline={true}
                                value={friendSearch}
                                style={{
                                    width: "70%",
                                    fontSize: 17,
                                    maxHeight: 100,
                                }}
                                onChangeText={(value) => {
                                    setFriendSearch(value);
                                }}
                            />
                            {friendSearch && (
                                <MaterialIcons name="cancel" size={25}
                                    onPress={() => setFriendSearch("")}
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                    }}
                                />
                            )}
                        </View>
                        <View
                            style={{
                                width: "100%",
                                marginHorizontal: 5,
                                top: 50,
                            }}>
                            <FlatList
                                onRefresh={getAllFriend}
                                refreshing={isLoadingFriend}
                                data={friendSearch ? dataFriendSearch : friends}
                                renderItem={renderFriendItem}
                                ListEmptyComponent={() => (
                                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 180 }}>
                                        <Image style={{ width: 70, height: 70, marginBottom: 20 }} source={require("../../assets/img/add-group.png")} />
                                        <Text style={{ fontSize: 20 }}>Bạn chưa có bạn bè nào.</Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <StatusBar backgroundColor='white' barStyle={'dark-content'} />
            <Toast />
        </SafeAreaView>
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
        marginRight: 10,
        marginLeft: 10,
        flexDirection: 'row'
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
        width: "100%",
        height: "100%",
    },
    conversation: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        margin: 5,
        marginHorizontal: 10,
        width: windowWidth,
    },
    newChatModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
    },
    modal: {
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: "white",
        width: '100%',
        height: "100%",
        top: 50

    },
})