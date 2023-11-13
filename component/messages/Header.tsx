import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { blankAvatar } from '../../screens/friendScreen/FriendScreen'
import { useUnreadMessages } from '../../contexts/UnreadMessages '
import COLORS from '../../assets/conts/color'

const Header = ({
    navigation,
    setModalUpdateVisible,
    isModalUpdateVisible,
    isGroup,
    groupAvatar,
    members,
    userData,
    groupName,
    memberAvatar
}: any) => {
    const { unreadMessages } = useUnreadMessages();
    return (
        <SafeAreaView
            style={{
                width: "100%", height: "100%", justifyContent: "flex-start",
                alignItems: "flex-end", flexDirection: "row", gap: 10, backgroundColor: COLORS.main_color,
            }}
        >
            <StatusBar barStyle={'light-content'} backgroundColor={COLORS.main_color} />
            <TouchableOpacity style={{ height: 50, justifyContent: "center" }}
                onPress={() => navigation.navigate('HomeTabs', { screen: 'ChatScreen' })}
            >
                <View style={{ marginHorizontal: 10, flexDirection: "row", gap: 0 }}>
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={27}
                        color='#FFFFFF'
                    />
                    {unreadMessages > 0 && (
                        <View
                            style={{
                                position: "absolute",
                                left: 13,
                                top: 3,
                                borderRadius: 50,
                                backgroundColor: '#FFFFFF',
                                width: 20,
                                height: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: COLORS.main_color, fontSize: 15 }}>
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
                {/* Avatar */}
                <View >
                    {groupAvatar && (
                        <View style={{
                            width: 40,
                            height: 40,
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
                                                    right: 5, top: 15,
                                                    width: 30, height: 30,
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
                                                    left: 10, bottom: 20,
                                                    width: 30, height: 30,
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
                                        width: 40,
                                        height: 40,
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
                {/* Group name */}
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: COLORS.white }}>
                            {groupName
                                ? groupName
                                : members.map(member => member.username).join(', ')}
                        </Text>
                        {/* {isGroup &&
                            <MaterialIcons name="edit" size={20} color='#FDFDFD' />
                        } */}
                    </View>
                    {isGroup &&
                        <Text style={{ color: COLORS.white }}>
                            {`${members.length + 1} thành viên`}
                        </Text>
                    }

                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({})
