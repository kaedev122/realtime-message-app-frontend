import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity } from "react-native";
import { getFriendByNameApi } from "../../services/FriendService";

const SearchScreen = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchFriends = async () => {

        setIsLoading(true);
        console.log(searchResults)
        try {
            const response = await getFriendByNameApi({ username: searchValue });
            const { data } = response;
            setSearchResults(data.usersData);
            console.log(setSearchResults)
        } catch (error) {
            console.error("Lỗi khi tìm kiếm bạn bè:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const renderFriendItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                }}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                }}
            >
                <Image
                    source={{ uri: item.profilePicture }}
                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                />
                <Text>{item.username}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginBottom: 10,
                }}
                placeholder="Nhập username bạn bè"
                onChangeText={text => setSearchValue(text)}
            />
            <Button
                title="Tìm kiếm"
                onPress={() => searchFriends()} // Sử dụng hàm searchFriends
            />

            {isLoading && <Text>Đang tìm kiếm...</Text>}
            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderFriendItem}
                    keyExtractor={(item) => item._id}
                />
            ) : (
                <Text>Không có kết quả tìm kiếm.</Text>
            )}
        </View>
    );
};

export default SearchScreen;
