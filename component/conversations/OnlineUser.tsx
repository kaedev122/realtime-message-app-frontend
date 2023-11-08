import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blankAvatar } from '../../screens/friendScreen/FriendScreen'
import { getConversationOf2UserAPI } from '../../services/ChatService';

const OnlineUser = ({ friends, onlineUsers, userData, navigation, isSeen }: any) => {
    const onlineFriends = friends.filter(friend => onlineUsers.includes(friend._id));
    const [conversationID, setConversationId] = useState()
    const [members, setMembers] = useState([])
    const [isGroup, setGroup] = useState<boolean>()

    useEffect(() => {
        if (friends.length > 0) {
            const initialFriendId = friends[0]?._id
            getConversationOf2User(userData._id, initialFriendId);
        }
    }, []);
    const getConversationOf2User = async (friendId: string) => {
        try {
            const res = await getConversationOf2UserAPI(userData._id, friendId);
            const { data } = res
            setConversationId(data._id)
            setMembers(data.members)
            setGroup(data.group)
        } catch (error: any) {
            alert(error.response);
        }
    }
    const renderOnlineUserItem = ({ item }: any) => {

        const isOnline = onlineUsers.includes(item?._id);
        const avatar = item?.profilePicture
        return (
            <TouchableOpacity style={{ flexDirection: "column", alignItems: "center", gap: 5, margin: 5 }}
                onPress={() => {
                    getConversationOf2User(item._id)
                    console.log("members:", members)
                    console.log("members:", members)
                    isSeen(conversationID);
                    // navigation.navigate("MessageScreen", {
                    //     userData: userData,
                    //     conversationId: conversationID,
                    //     members: members,
                    //     isGroup: isGroup,
                    //     memberAvatar: memberAvatar.map(image => image),
                    //     groupName: item?.groupName,
                    //     groupAvatar: item?.groupAvatar
                    // })
                }} >
                <View style={styles.conversationImage}>
                    <Image
                        source={avatar ? { uri: avatar } : blankAvatar}
                        style={{
                            width: "100%", height: "100%", borderRadius: 50
                        }}
                    />
                    {isOnline &&
                        <View style={{
                            height: 18, width: 18, backgroundColor: "#54cc0e", borderRadius: 10, borderWidth: 3,
                            position: "absolute", bottom: 0, right: 0, borderColor: "#FFFFFF"
                        }}></View>}
                </View>
                <Text>{item?.username}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            style={{ margin: 10 }}
            data={friends}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            renderItem={(item) => renderOnlineUserItem(item)}
        />
    )
}

export default OnlineUser

const styles = StyleSheet.create({
    conversationImage: {
        width: 65,
        height: 65,
        borderRadius: 50,
        flexDirection: 'row',
    },
})