import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Ionicons } from '@expo/vector-icons'
const windownWidth = Dimensions.get('window').width
const windownHeight = Dimensions.get('window').height

const ContactsScreen = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState()

    const handleSearch = (text) => {
        setSearch(text)
        const filteredData = contacts.filter((user) =>
            user.username.toLowerCase().includes(text.toLowerCase())
        ) 
        setFilteredUsers(contacts)
    }
    

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            onPress={() =>
                navigation.navigate('MessageScreen', {
                    username: item.username,
                })
            }
            style={[
                {
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 22,
                    
                },
                index % 2 !== 0
                    ? {
                    }
                    : null,
            ]}
        >
            <View
                style={{
                    paddingVertical: 15,
                    marginRight: 22,
                }}
            >
                {item.isOnline && item.isOnline == true && (
                    <View
                        style={{
                            height: 14,
                            width: 14,
                            borderRadius: 7,
                            backgroundColor: 'green',
                            borderColor: 'white',
                            borderWidth: 2,
                            position: 'absolute',
                            top: 14,
                            right: 2,
                            zIndex: 1000,
                        }}
                    ></View>
                )}

                <Image
                    source={item.userImg}
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
                    flexDirection: 'column',
                }}
            >
                <Text  style={{ color: 'black', fontWeight: "bold" }}>
                    {item.username}
                </Text>
                <Text style={{ fontSize: 14, }}>
                    {item.lastSeen}
                </Text>
            </View>
        </TouchableOpacity>
    )

    const contacts = [
        {
          id: '1',
          username: 'John Doe',
          userImg: require('../../assets/img/male.png'),
          isOnline: true,
          lastSeen: 'Just Now',
        },
        {
          id: '2',
          username: 'Jane Doe',
          userImg: require('../../assets/img/male.png'),

          isOnline: false,
          lastSeen: 'Last seen yesterday',
        },
        {
          id: '3',
          username: 'Peter Parker',
          userImg: require('../../assets/img/male.png'),

          isOnline: false,
          lastSeen: 'Last seen 2 days ago',
        },
        {
          id: '4',
          username: 'Mary Jane Watson',
          userImg: require('../../assets/img/male.png'),

          isOnline: true,
          lastSeen: 'Last seen 1 hour ago',
        },
        {
          id: '5',
          username: 'Bruce Wayne',
          userImg: require('../../assets/img/male.png'),

          isOnline: false,
          lastSeen: 'Last seen last week',
        },
      ];
      



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: 22,
                        marginTop: 22,
                    }}
                >
                    <Text >Contacts</Text>
                    <TouchableOpacity
                        onPress={() => console.log('Add contacts')}
                    >
                        <AntDesign
                            name="plus"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        marginHorizontal: 22,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 48,
                        marginVertical: 22,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}
                >
                    <Ionicons
                        name="ios-search-outline"
                        size={24}
                    />
                    <TextInput
                        value={search}
                        placeholder="Tìm kiếm"
                        onChangeText={(value) => {
                            setSearch(value);
                        }}
                    />
                </View>

                <View
                    style={{
                        paddingBottom: 100,
                    }}
                >
                    <FlatList
                        data={contacts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ContactsScreen
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