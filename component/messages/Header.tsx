import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { blankAvatar } from '../../screens/friendScreen/FriendScreen'

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
    return (
        <View
            style={{
                width: "100%", height: "100%", justifyContent: "flex-start",
                alignItems: "flex-end", flexDirection: "row", gap: 5
            }}
        >
            <StatusBar barStyle={'dark-content'} backgroundColor={"#FFFFFF"} />
            <TouchableOpacity style={{ height: 50, justifyContent: "center", paddingLeft: 10, paddingRight: 5 }}
                onPress={() => navigation.navigate('HomeTabs', { screen: 'ChatScreen' })}
            >
                <MaterialIcons
                    name="arrow-back-ios"
                    size={27}
                    color="rgba(255, 93, 49, 1)"
                />
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
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            marginRight: 10,
                        }}>
                            <View style={{
                                flex: 1,
                                padding: 1,
                            }}>
                                <Image
                                    source={{ uri: groupAvatar }}
                                    style={{
                                        width: 50, height: 50, borderRadius: 50
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
                                        marginRight: 10,
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            padding: 1,
                                        }}>
                                            <Image
                                                source={userData.profilePicture ? { uri: userData.profilePicture } : blankAvatar}
                                                style={{
                                                    right: 5, top: 15,
                                                    width: 40, height: 40,
                                                    resizeMode: "cover",
                                                    borderRadius: 50,
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
                                                source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
                                                style={{
                                                    left: 10, bottom: 25,
                                                    width: 40, height: 40,
                                                    resizeMode: "cover",
                                                    borderRadius: 50,
                                                    borderColor: "#f3f4fb",
                                                    borderWidth: 2
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 50,
                                        marginRight: 10,
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            padding: 1,
                                        }}>
                                            <Image
                                                source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}

                                                style={{
                                                    width: "100%", height: "100%", borderRadius: 50
                                                }}
                                            />
                                        </View>
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
// useLayoutEffect(() => {
//     navigation.setOptions({
//         headerTitle: "",
//         headerStyle: {
//             height: 100
//         },
//         headerLeft: () => (
//             <View
//                 style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }}
//             >
//                 <MaterialIcons
//                     onPress={() => navigation.navigate('HomeTabs', { screen: 'ChatScreen' })}
//                     name="arrow-back"
//                     size={24}
//                     color="#FF9134"
//                 />

//                 <TouchableOpacity
//                     onPress={() => {
//                         {
//                             isGroup && setModalUpdateVisible(!isModalUpdateVisible)
//                         }
//                     }}
//                     style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: 10
//                     }}>

//                     <View >
//                         {groupAvatar && (
//                             <View style={{
//                                 width: 50,
//                                 height: 50,
//                                 borderRadius: 50,
//                                 marginRight: 10,
//                             }}>
//                                 <View style={{
//                                     flex: 1,
//                                     padding: 1,
//                                 }}>
//                                     <Image
//                                         source={{ uri: groupAvatar }}
//                                         style={{
//                                             width: 50, height: 50, borderRadius: 30
//                                         }}
//                                     />
//                                 </View>
//                             </View>
//                         )
//                             ||
//                             (
//                                 (members.length > 1)
//                                     ? (
//                                         <View style={{
//                                             width: 50,
//                                             height: 50,
//                                             borderRadius: 50,
//                                             marginRight: 10,
//                                         }}>
//                                             <View style={{
//                                                 flex: 1,
//                                                 padding: 1,
//                                             }}>
//                                                 <Image
//                                                     source={userData.profilePicture ? { uri: userData.profilePicture } : blankAvatar}
//                                                     style={{
//                                                         right: 5, top: 15,
//                                                         width: 40, height: 40,
//                                                         resizeMode: "cover",
//                                                         borderRadius: 50,
//                                                         borderColor: "#f3f4fb",
//                                                         borderWidth: 2
//                                                     }}
//                                                 />
//                                             </View>


//                                             <View style={{
//                                                 flex: 1,
//                                                 padding: 1,
//                                             }}>
//                                                 <Image
//                                                     source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}
//                                                     style={{
//                                                         left: 10, bottom: 25,
//                                                         width: 40, height: 40,
//                                                         resizeMode: "cover",
//                                                         borderRadius: 50,
//                                                         borderColor: "#f3f4fb",
//                                                         borderWidth: 2
//                                                     }}
//                                                 />
//                                             </View>
//                                         </View>
//                                     ) : (
//                                         <View style={{
//                                             width: 50,
//                                             height: 50,
//                                             borderRadius: 50,
//                                             marginRight: 10,
//                                         }}>
//                                             <View style={{
//                                                 flex: 1,
//                                                 padding: 1,
//                                             }}>
//                                                 <Image
//                                                     source={memberAvatar[0] ? { uri: memberAvatar[0] } : blankAvatar}

//                                                     style={{
//                                                         width: "100%", height: "100%", borderRadius: 30
//                                                     }}
//                                                 />
//                                             </View>
//                                         </View>
//                                     )
//                             )
//                         }

//                     </View>

//                     {groupName &&
//                         <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
//                             {groupName}
//                         </Text>
//                         ||
//                         <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
//                             {members.map(member => member.username).join(', ')}
//                         </Text>
//                     }
//                     {isGroup &&
//                         <MaterialIcons name="edit" size={20} color="#fca120ad" />
//                     }
//                 </TouchableOpacity>
//             </View>
//         ),
//         // headerRight: () =>
//         //     selectedMessages.length > 0 ? (
//         //         <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
//         //             <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
//         //             <Ionicons name="md-arrow-undo" size={24} color="black" />
//         //             <FontAwesome name="star" size={24} color="black" />
//         //             <MaterialIcons
//         //                 onPress={() => deleteMessages(selectedMessages)}
//         //                 name="delete"
//         //                 size={24}
//         //                 color="black"
//         //             />
//         //         </View>
//         //     ) : null,
//     });
// }, [groupAvatar]);
