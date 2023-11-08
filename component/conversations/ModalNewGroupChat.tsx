import { Dimensions, FlatList, Image, Modal, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { blankAvatar } from '../../screens/friendScreen/FriendScreen'
import Checkbox from 'expo-checkbox'
const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width
const ModalNewGroupChat = ({
    isModalVisible,
    setModalVisible,
    getAllFriend,
    userData,
    resetFriendSelection,
    newGroupChat,
    setSelectedIds,
    friends,
    setFriends,
    setFriendSearch,
    numSelected,
    friendSearch,
    dataFriendSearch,
    isLoadingFriend
}: any) => {


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

        <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(!isModalVisible)}
        >
            <StatusBar barStyle={'light-content'} />
            <View style={{ height: windowHeight, width: windowWidth, justifyContent: "flex-end", backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                <View style={{
                    borderRadius: 20,
                    alignItems: 'center',
                    backgroundColor: "white",
                    width: "100%",
                    height: windowHeight - 50,
                }}>
                    {/* Huỷ */}
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
                    {/* Tạo */}
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: 10,
                            top: 0,
                            padding: 10,
                        }}
                        onPress={newGroupChat}
                    >
                        <Text style={{ color: (numSelected > 1) ? "#FF9134" : "#eee", fontSize: 20, fontWeight: "bold" }}>Tạo</Text>
                    </TouchableOpacity>
                    {/* Search */}
                    <View style={{
                        marginTop: 50,
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        backgroundColor: "#f3f4fa",
                        padding: 5,
                        gap: 5
                    }}>
                        <Text style={{ fontSize: 17, color: "gray", marginLeft: 10 }}>Đến:</Text>
                        <TextInput
                            multiline={true}
                            value={friendSearch}
                            style={{
                                flex: 1,
                                fontSize: 17,
                                maxHeight: 100,
                            }}
                            onChangeText={(value) => {
                                setFriendSearch(value);
                            }}
                        />
                        {friendSearch && (
                            <MaterialIcons name="cancel" size={25}
                                color="gray"
                                onPress={() => setFriendSearch("")}
                                style={{
                                    // position: "absolute",
                                    // right: 10,
                                    // bottom: 5,
                                    paddingHorizontal: 10
                                }}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginHorizontal: 5,
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

    )
}

export default ModalNewGroupChat

const styles = StyleSheet.create({})