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
import { getFriendByNameApi, getRandomFriendApi } from "../../services/FriendService";

const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height

const SearchFriendScreen = ({ route }: any) => {
    const { userData } = route.params;
    const [randomFriends, setRandomFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const getRandomFriend = async () => {
        setIsLoading(true);
        try {
            const listData = await getRandomFriendApi();
            const { data } = listData;
            setRandomFriends(data.result);
        } catch (error: any) {
            alert(error.response);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getRandomFriend();
    }, []);

    const searchFriends = async () => {
        setIsLoading(true);
        console.log(searchValue)
        try {
            if (searchValue === "") {
                const listData = await getRandomFriendApi();
                const { data } = listData;
                setSearchResults(data.result);
            } else {
                const response = await getFriendByNameApi(searchValue);
                const { data } = response;
                setSearchResults(data.usersData);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderFriendItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                onPress={() => {
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
                    <Text style={{ color: 'black' }}>
                        {item.username}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.heading}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tìm Kiếm</Text>
                </View>
                <View style={{ width: "95%", flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        placeholder="Tìm kiếm"
                        style={styles.searchInput}
                        onChangeText={(value) => setSearchValue(value)}
                    />
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            width: 30,
                            height: 30,
                            position: "absolute",
                            right: 0,
                            backgroundColor: "black",
                        }}
                        onPress={searchFriends}
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
                        onRefresh={getRandomFriend}
                        refreshing={isLoading}
                        data={searchResults.length > 0 ? searchResults : randomFriends}
                        renderItem={renderFriendItem}
                    />
                </View>
            </View>
        </SafeAreaView>
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
});
