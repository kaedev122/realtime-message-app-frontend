import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Feather, FontAwesome } from '@expo/vector-icons';
const windowWidth = Dimensions.get("window").width
const Footer = ({ press, setPress, newMessage, setNewMessage, image, setImage, sendMessage }: any) => {

    const pickImageForMessage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri)

        }
    }
    return (
        <View style={{ flexDirection: "row", width: "100%", height: "100%" }}>
            {!press &&
                <View style={styles.icon} >
                    {/* <TouchableOpacity onPress={pickImageForMessage} >
                        <Image source={require('../../assets/img/camera.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={pickImageForMessage} >
                        <Image source={require('../../assets/img/uploadPhoto.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                </View>
            }

            <TextInput
                value={newMessage}
                multiline={true}
                placeholderTextColor="#888"
                onChangeText={(value) => {
                    setNewMessage(value);
                }}
                onFocus={() => setPress(true)}
                onBlur={() => setPress(false)}
                style={styles.messageInput}
                placeholder="Nhập tin nhắn ..."
            />

            {(newMessage || image) &&
                <TouchableOpacity
                    onPress={sendMessage}
                    style={styles.sendBtn}
                >
                    <FontAwesome name="send" size={24} color="#FF9134" />
                </TouchableOpacity>
            }

        </View>
    )
}

export default Footer

const styles = StyleSheet.create({
    messageInput: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingTop: 7,
        backgroundColor: "#FAFAFA",
        fontSize: 18,
        maxHeight: 150,
        minHeight: 40,

    },
    sendBtn: {
        padding: 10,
    },
    icon: {
        padding: 10,
        flexDirection: "row",
        gap: 15,

    },
})