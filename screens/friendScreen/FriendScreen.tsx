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
    Button
} from "react-native";
import {getAllFriendApi} from "../../services/FriendService";

const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height
const FriendScreen = ({route} :any) => {
    const { userData } = route.params
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllFriend = async () => {
        setIsLoading(true);
        try {
            const listData = await getAllFriendApi();
            const {data} = listData;
            setFriends(data.friendList);
        } catch (error: any) {
            alert(error.response);
        }
        setIsLoading(false)
    };
    useEffect(() => {
        getAllFriend();
    }, []);
    const renderFriendItem = ({ item }:any) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        setSelectedFriend(item);
                        setDialogVisible(true);
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
                            source={item.profilePicture || require("../../assets/img/profile.png")}
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
                        <Text style={{color: 'black'}}>
                            {item.username}
                        </Text>
                        {/*<Text style={{fontSize: 14,}}>*/}
                        {/*    {item.lastSeen}*/}
                        {/*</Text>*/}
                    </View>
                </TouchableOpacity>
            );
    };

    // const renderDialog = () => {
    //     return (
    //         <Modal
    //             visible={dialogVisible}
    //             onRequestClose={() => {
    //                 setDialogVisible(false);
    //             }}
    //         >
    //             <View style={{
    //                 width: 250,
    //                 height: 250,
    //                 backgroundColor: "white",
    //                 borderRadius: 10,
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //             }}>
    //                 <Image
    //                     source={selectedFriend.profilePicture || require("../../assets/img/profile.png")}
    //                     resizeMode="contain"
    //                     style={{
    //                         height: 100,
    //                         width: 100,
    //                         borderRadius: 50,
    //                     }}
    //                 />
    //                 <Text style={{
    //                     fontSize: 20,
    //                     fontWeight: "bold",
    //                 }}>{selectedFriend.username}</Text>
    //                 <Button
    //                     title="Hủy kết bạn"
    //                     onPress={() => {
    //                         // TODO: Thực hiện việc hủy kết bạn
    //                     }}
    //                 />
    //                 <Button
    //                     title="Đóng"
    //                     onPress={() => {
    //                         setDialogVisible(false);
    //                     }}
    //                 />
    //             </View>
    //         </Modal>
    //     );
    // };
    // const hideDialog = () => {
    //     setDialogVisible(false);
    // };

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
            </View>
            {/*<Modal*/}
            {/*    visible={dialogVisible}*/}
            {/*    onRequestClose={hideDialog}*/}
            {/*>*/}
            {/*    {renderDialog()}*/}
            {/*</Modal>*/}
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
        marginBottom: windownHeight * 0.3
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
})