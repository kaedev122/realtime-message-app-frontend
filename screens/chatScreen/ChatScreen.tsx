import { StyleSheet, Text, View, TextInput, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-navigation';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { getAllConversationApi } from '../../services/ChatService'
import { getUserDataByIdApi } from '../../services/UserService'

const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height

const ChatScreen = ({ navigation, route }: any) => {
    const { userData } = route.params
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [conversation, setConversation] = useState([]);
    const [textSearch, setTextSearch] = useState<string>("");
    const [dataSearch, setDataSearch] = useState([]);

    const getConversation = async () => {
        setIsLoading(true);
        try {
            const listData = await getAllConversationApi();
            const { data } = listData;
            setConversation(data);
        } catch (error: any) {
            alert(error.response);
        }
        setIsLoading(false);
    };

    const renderConversationItem = ({ item }: any) => {
        const members = item.members.filter(member => member._id != userData._id);
        const numMembers = members.length
        const memberImages = members.map(member => member.profilePicture)
        let conversationImage = 'https://github.com/kaedev122/realtime-message-app-frontend/blob/huybe/assets/img/profileClone.jpg?raw=true'
        const memberProfilePictures = memberImages.map(image => image || conversationImage);

        return (
            <TouchableOpacity style={styles.conversation} onPress={() => {
                navigation.navigate('MessageScreen', {
                    userData: userData,
                    conversationId: item._id,
                    members: members,
                    isGroup: item.group,
                    conversationImage: memberProfilePictures,
                });
            }}>
                <View>
                    {numMembers > 1
                        ? (
                            <View style={styles.conversationImage}>
                                <View style={{
                                    flex: 1,
                                    padding: 1,
                                }}>
                                    <Image
                                        source={{ uri: userData.profilePicture || conversationImage }}
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
                                        source={{ uri: memberImages[0] || conversationImage }}
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
                                        source={{ uri: memberImages[0] || conversationImage }}
                                        style={{
                                            width: "100%", height: "100%", borderRadius: 30
                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                </View>
                <View style={{
                    borderBottomColor: "#dedad5",
                    borderBottomWidth: 1,
                    width: "100%"
                }}>
                    <Text style={{ fontSize: 20 }}>{members.map(member => member.username).join(', ')}</Text>
                    <Text style={{ fontSize: 13, color: "gray" }}>{item?.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const handleSearch = (textSearch: string) => {
        const result = conversation.filter((item) => {
            const memberNames = item.members.map(
                (member) => member.username
            )
            const combinedNames = memberNames.join(' ').toLowerCase();
            return combinedNames.includes(textSearch.toLowerCase());
        }
        );
        setDataSearch(result);
    };

    useEffect(() => {
        getConversation();
        // console.log({ userData })
    }, []);

    useEffect(() => {
        handleSearch(textSearch);
    }, [textSearch]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.heading}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }} >Đoạn chat </Text>
                    <TouchableOpacity
                        style={{ position: "absolute", right: 20, width: 30, height: 30 }}
                        onPress={() => { navigation.navigate("NewGroupChat"); }}
                    >
                        <Entypo name="new-message" size={25} color="#428DFE" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "95%", flexDirection: "row", alignItems: "center" }}>
                    {/* <Ionicons
                        name="ios-search-outline"
                        size={24}
                    /> */}
                    <TextInput
                        value={textSearch}
                        placeholder="Tìm kiếm"
                        style={styles.searchInput}
                        onChangeText={(value) => {
                            setTextSearch(value);
                        }}
                    />
                    {
                        textSearch &&

                        <MaterialIcons name="cancel" size={25}
                            onPress={() => setTextSearch("")}
                            style={{
                                position: "absolute",
                                right: 10,
                            }}
                        />

                    }
                </View>
            </View>
            <View style={styles.body}>
                <FlatList
                    onRefresh={getConversation}
                    refreshing={isLoading}
                    data={textSearch ? dataSearch : conversation}
                    renderItem={(item) => renderConversationItem(item)}
                />
            </View>
            <StatusBar style="dark" />
        </SafeAreaView >
    );
}

export default ChatScreen

const styles = StyleSheet.create({
    // conversationImage: {
    //     flex: 1,
    //     flexDirection: 'row',
    // },
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
        marginRight: 10,
        flexDirection: 'row'
    },
    container: {
        flex: 1,
    },
    heading: {
        width: "100%",
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
        marginVertical: 10,
        fontSize: 20
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