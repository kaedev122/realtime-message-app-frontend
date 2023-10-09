import { StyleSheet, Text, View, TextInput, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
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
        } catch (error:any) {
            alert(error.response);
        }
        setIsLoading(false);
    };

    const renderConversationItem = ({ item }:any) => {
        let receiver = {}
        // console.log(item.members[0]._id)
        // console.log(userData._id)

        if (item.members[0]._id == userData._id) {
            receiver = item.members[1]
        } else {
            receiver = item.members[0]
        }
        const conversationImage = receiver?.profilePicture ? `${receiver?.profilePicture}` : `https://cdn-icons-png.flaticon.com/512/847/847969.png`
        
        return (
            <TouchableOpacity style={styles.conversation} onPress={() => {
                navigation.navigate('MessageScreen', {
                    userData: userData,
                    conversationId: item._id,
                    member1: item.members[0],
                    member2: item.members[1],
                });
            }}>
                <Image
                    style={styles.conversationImage}
                    source={{
                        uri: conversationImage
                    }}
                />
                <View style={{
                    borderBottomColor: "#dedad5",
                    borderBottomWidth: 1,
                    width: "100%"
                }}>
                    <Text style={{ fontSize: 20 }}>{receiver?.username}</Text>
                    <Text style={{ fontSize: 13, color: "gray" }}>{item?.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const handleSearch = (searchText: string) => {
        const filteredConversation = conversation.filter((item) =>
            item?.members[1].username.toLowerCase().includes(searchText.toLowerCase())
        );
        setDataSearch(filteredConversation);
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
                    <Entypo style={{ position: "absolute", right: 20 }} onPress={() => {
                        navigation.navigate("NewMessageScreen");
                    }}
                        name="new-message" size={25} color="#428DFE" />
                </View>
                <View style={{ width: "95%", flexDirection: "row", alignItems: "center" }}>
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