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
        let conversationImage = 'https://raw.githubusercontent.com/kaedev122/realtime-message-app-frontend/huybe/assets/img/user.png'
        if (numMembers > 1) {
            conversationImage = 'https://github.com/kaedev122/realtime-message-app-frontend/blob/huybe/assets/img/group.png?raw=true'
        } else if (numMembers > 0) {
            conversationImage = members[0]?.profilePicture || conversationImage
        }
        //  console.log(conversationImage)

        return (
            <TouchableOpacity style={styles.conversation} onPress={() => {
                navigation.navigate('MessageScreen', {
                    userData: userData,
                    conversationId: item._id,
                    members: members,
                    conversationImage: conversationImage,
                });
            }}>
                <Image
                    style={styles.conversationImage}
                    source={{ uri: conversationImage }}
                />
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
                        onPress={() => { navigation.navigate("NewChat"); }}
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
                    <TouchableOpacity
                        onPress={() => setTextSearch("")}
                        style={{ justifyContent: "center", width: 30, height: 30, position: "absolute", right: 0, backgroundColor: "#d3d3d3" }}>

                        {textSearch ? <MaterialIcons name="cancel" size={20} /> : null}

                    </TouchableOpacity>
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