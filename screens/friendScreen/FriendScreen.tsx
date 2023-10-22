import React, { useState, useEffect } from "react";
import {
    FlatList,
    TouchableOpacity,
    Image,
    Text,
    SafeAreaView,
    View,
    Modal,
    TextInput,
    Dimensions,
    StyleSheet
} from "react-native";
import {addFriendApi, getAllFriendApi, unFriendApi} from "../../services/FriendService";
import { AntDesign } from '@expo/vector-icons';
import { createNewChat } from "../../services/ChatService";
import {showToast} from "../../component/showToast";
import Toast from "react-native-toast-message";

const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height

const FriendScreen = ({ navigation, route }: any) => {
    const { userData } = route.params;
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [conversations, setConversations] = useState([]);

    const getAllFriend = async () => {
        setIsLoading(true);
        try {
            const listData = await getAllFriendApi();
            const { data } = listData;
            setFriends(data.friendList);
        } catch (error) {
            alert(error.response);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getAllFriend();
    }, []);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const unFriend = async (id: string) => {
        try {
            const response = await unFriendApi(id);
            if (response.status === 200) {
                showToast("success","Hủy kết bạn thành công")
                toggleModal();
                getAllFriend();
            }
        } catch (error) {
            console.error("Lỗi khi hủy kết bạn:", error);
        }
    };
    const renderFriendItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedUser(item);
                    toggleModal();
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
                        paddingVertical: 15,
                        marginRight: 22,
                    }}
                >
                    <Image
                        source={{ uri: item.profilePicture || "https://raw.githubusercontent.com/kaedev122/realtime-message-app-frontend/huybe/assets/img/user.png?fbclid=IwAR3H4i5FTak6CrmPVGwwDtwcvSfMpDK4SGT6ReNvWU2YQrnr1uHoMlKQ5A4" }}
                        resizeMode="contain"
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "column",
                    }}
                >
                    <Text style={{ color: 'black' }}>
                        {item.username}
                    </Text>
                    {/*<Text style={{fontSize: 14,}}>*/}
                    {/*    {item.lastSeen}*/}
                    {/*</Text>*/}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.heading}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bạn bè</Text>
                </View>
                <View style={{ width: "95%", flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        placeholder="Tìm kiếm"
                        style={styles.searchInput}
                        onChangeText={(value) => {
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            width: 30,
                            height: 30,
                            position: "absolute",
                            right: 0,
                            backgroundColor: "#d3d3d3",
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginHorizontal: 22,
                        marginTop: 22,
                    }}
                />
                <View style={{ paddingBottom: 100 }}>
                    <FlatList
                        onRefresh={getAllFriend}
                        refreshing={isLoading}
                        data={friends}
                        renderItem={renderFriendItem}
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 180 }}>
                                <Image style={{ width: 70, height: 70, marginBottom: 20 }} source={require("../../assets/img/add-group.png")} />
                                <Text style={{ fontSize: 20 }}>Bạn chưa có bạn bè nào.</Text>
                            </View>
                        )}
                    />
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={toggleModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={toggleModal}>
                                <AntDesign name="closesquare" size={24} color="black" />
                            </TouchableOpacity>

                            <View>
                                <Text style={styles.modalText}>{selectedUser?.username}</Text>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                    }}
                                >
                                    <Text style={styles.buttonText}>Thông tin</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.redButton]}
                                    onPress={() => {
                                        { unFriend(selectedUser?._id) }
                                    }}
                                >
                                    <Text style={[styles.buttonText, styles.redButtonText]}>Hủy kết bạn</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <Toast/>
        </SafeAreaView>
    );
};

export default FriendScreen;

const styles = StyleSheet.create({
    conversationImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10
    },
    container: {
        flex: 1,
    },
    heading: {
        width: "100%",
        height: windownHeight * 0.2 + 20,
        alignItems: "center",
        backgroundColor: "#fafafa"
    },
    header: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: windownHeight * 0.09
    },
    searchInput: {
        backgroundColor: "#d3d3d3",
        borderRadius: 10,
        padding: 10,
        width: "100%",
        marginVertical: 10
    },
    body: {
        width: "100%",
        marginHorizontal: 5,
    },
    conversation: {
        paddingVertical: 5,
        flexDirection: "row"
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: windownWidth * 0.8,
        maxHeight: windownHeight * 0.5,
        justifyContent: "center",
        alignItems: "center",
    },
    modalText: {
        fontSize: 20,
        color: "black",
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: 'blue', // Màu nền của nút Nhắn tin
        borderRadius: 10,
        padding: 10,
        margin: 5,
    },
    redButton: {
        backgroundColor: 'red', // Màu nền của nút Hủy kết bạn
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    redButtonText: {
        // Kiểu dáng cho nút Hủy kết bạn
    },
});
