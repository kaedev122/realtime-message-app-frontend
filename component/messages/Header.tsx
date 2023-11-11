import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { blankAvatar } from '../../screens/friendScreen/FriendScreen'
import { useUnreadMessages } from '../../contexts/UnreadMessages '

const Header = ({
    navigation,
    setModalUpdateVisible,
    isModalUpdateVisible,
    isGroup,
    groupAvatar,
    members, userData,
    groupName,
    memberAvatar
}: any) => {
    const { unreadMessages } = useUnreadMessages();

    return (
        <View
            style={{
                width: "100%", height: "100%", justifyContent: "flex-start",
                alignItems: "flex-end", flexDirection: "row", gap: 10
            }}
        >
            <StatusBar barStyle={'dark-content'} backgroundColor={"#FFFFFF"} />
            <TouchableOpacity style={{ height: 50, justifyContent: "center" }}
                onPress={() => navigation.navigate('HomeTabs', { screen: 'ChatScreen' })}
            >
                <View style={{ marginHorizontal: 10, flexDirection: "row", gap: 0 }}>
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={27}
                        color="#FF9134"
                    />
                    {unreadMessages > 0 && (
                        <View
                            style={{
                                position: "absolute",
                                left: 13,
                                top: 3,
                                borderRadius: 50,
                                backgroundColor: '#FF9134',
                                width: 20,
                                height: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 15 }}>
                                {unreadMessages}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    {
                        isGroup && setModalUpdateVisible(!isModalUpdateVisible)
                    }
                }}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>

                <View >
                    {groupAvatar && (
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 50,
                            marginBottom: 5,
                        }}>
                            <View style={{
                                flex: 1,
                                padding: 1,
                            }}>
                                <Image
                                    source={{ uri: groupAvatar }}
                                    style={{
                                        width: "100%", height: "100%", borderRadius: 50
                                    }}
                                />
                            </View>
                        </View>
                    )
                        ||
                        (
                            (members.length > 1)
                                ? (
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 50,
                                        marginBottom: 5,
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            padding: 1,
                                        }}>
                                            <Image
                                                source={userData.profilePicture ? { uri: userData.profilePicture } : blankAvatar}
                                                style={{
                                                    right: 5, top: 12,
                                                    width: 35, height: 35,
                                                    resizeMode: "cover",
                                                    borderRadius: 50,
                                                    borderColor: "#FFFFFF",
                                                    borderWidth: 2
                                                }}
                                            />
                                        </View>


                                        <View style={{
                                            flex: 1,
                                            padding: 1,
                                        }}>
                                            <Image
                                                source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
                                                style={{
                                                    left: 15, bottom: 25,
                                                    width: 35, height: 35,
                                                    resizeMode: "cover",
                                                    borderRadius: 50,
                                                    borderColor: "#FFFFFF",
                                                    borderWidth: 2
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: 50,
                                        marginBottom: 5,
                                    }}>
                                        <Image
                                            source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}

                                            style={{
                                                width: "100%", height: "100%", borderRadius: 50
                                            }}
                                        />
                                    </View>
                                )
                        )
                    }
                </View>

                {groupName &&
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                        {groupName}
                    </Text>
                    ||

                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                        {members.map(member => member.username).join(', ')}
                    </Text>
                }
                {isGroup &&
                    <MaterialIcons name="edit" size={20} color="#fca120ad" />
                }
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})
