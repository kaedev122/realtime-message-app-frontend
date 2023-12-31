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
    StyleSheet,
    Button,
} from "react-native";
import { addFriendApi, getFriendByNameApi, getRandomFriendApi } from "../../services/FriendService";
import { AntDesign, EvilIcons, Feather } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import { showToast } from "../../component/showToast";
import { blankAvatar } from "./FriendScreen";
import Header from "../../component/Header";
import COLORS from "../../assets/conts/color";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchFriendScreen = ({ navigation, route }: any) => {
    const [listFriend, setListFriend] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);



    const getRandomFriend = async () => {
        setIsLoading(true);
        try {
            const listData = await getRandomFriendApi();
            const { data } = listData;
            setListFriend(data.result);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bạn:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchFriends = async () => {
        setIsLoading(true);
        try {
            const listData = await getFriendByNameApi({ username: searchValue });
            const { data } = listData;
            setListFriend(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const addFriend = async (id: string) => {
        try {
            const response = await addFriendApi(id);
            if (response.status === 200) {
                console.log("Kết bạn thành công!");
                showToast("success", "Kết bạn thành công")
            }
        } catch (error) {
            console.error("Lỗi khi kết bạn:", error);
        }
    };

    const renderFriendItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedUser(item);
                    toggleModal();
                    console.log(item)
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
                        paddingVertical: 10,
                        marginRight: 22,
                    }}
                >
                    <Image
                        source={item.profilePicture ? { uri: item.profilePicture } : blankAvatar}

                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 50,
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
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    useEffect(() => {
        getRandomFriend();
    }, []);
    return (
        <View style={{ height: windowHeight - 80, width: windowWidth, backgroundColor: "#FFFFFF" }}>
            <Header>
                <SafeAreaView style={{
                    width: "100%", height: "100%", alignItems: "flex-end",
                    backgroundColor: COLORS.main_color, flexDirection: "row",
                }}>
                    {/* <StatusBar barStyle={'light-content'} backgroundColor={COLORS.main_color} /> */}
                    <View style={{
                        paddingLeft: 10, flex: 1, height: 40, gap: 10, flexDirection: "row", justifyContent: "center", alignItems: "center"
                    }}>
                        <TextInput
                            placeholder="Tìm kiếm"
                            placeholderTextColor={"#FFFFFF"}
                            style={{ flex: 1, height: "100%", fontSize: 18, color: "#FFFFFF" }}
                            onChangeText={(text) => setSearchValue(text)}

                        />

                    </View>
                    <TouchableOpacity
                        style={{ width: 50, height: 40, alignItems: "center", justifyContent: "center" }}
                        onPress={searchFriends}
                    >
                        <FontAwesome name="search" color="#FFFFFF" size={20} />
                    </TouchableOpacity>
                </SafeAreaView>

            </Header>


            <View style={{ flex: 1 }}>

                <View style={{ width: "100%", height: "100%" }}>
                    <FlatList
                        onRefresh={getRandomFriend}
                        refreshing={isLoading}
                        data={listFriend}
                        renderItem={renderFriendItem}
                    />
                </View>
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
                                    {
                                        addFriend(selectedUser?._id)
                                        toggleModal();
                                    }
                                }}
                            >
                                <Text style={[styles.buttonText, styles.redButtonText]}>Thêm Bạn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Toast />
        </View>
    );
};

export default SearchFriendScreen;

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
        height: windowHeight * 0.2 + 20,
        alignItems: "center",
        backgroundColor: "#fafafa"
    },
    header: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: windowHeight * 0.09
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
        width: windowWidth * 0.8,
        maxHeight: windowHeight * 0.5,
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
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 10,
        margin: 5,
    },
    redButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    redButtonText: {
    },
});
