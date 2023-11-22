import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { updateConversation } from '../../../services/ChatService';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { blankAvatar } from '../../../screens/friendScreen/FriendScreen';

const ModalUpdateUser = (
    {
        isModalUpdateVisible,
        setModalUpdateVisible,
        avatar,
        userData
    }
) => {
    const [newUsername, setNewUsername] = useState(userData.username);
  const [newPassword, setNewPassword] = useState(userData.password);

  // const [avatar, setAvatar] = useState<string>('');
  const [newAvatar, setNewAvatar] = useState<string>(avatar);

    const updateUser = async () => {
        const formData = new FormData()
        formData.append("username", userData.username)
        formData.append("password", userData.password)
        formData.append("avatar", {
            uri: newAvatar,
            name: "image.jpg",
            type: "image/jpeg",
        })
        try {
            const res = await updateConversation(userData._id , formData)
            console.log(res)
            setNewUsername(newUsername)
            setNewPassword(newPassword)
            setNewAvatar(newAvatar)
            setModalUpdateVisible(!isModalUpdateVisible)
        } catch (error) {

        }
    }
    const pickImageForUpdate = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            console.log(result.assets[0].uri)
            setNewAvatar(result.assets[0].uri)
        }
    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={isModalUpdateVisible}
            onRequestClose={() => setModalUpdateVisible(!isModalUpdateVisible)}
        >
            <View style={styles.modalUpdateBackground}>
                <TouchableOpacity style={styles.touchable}
                                  onPress={() => {
                                      setModalUpdateVisible(!isModalUpdateVisible)
                                      setNewUsername("")
                                      setNewPassword("")
                                      setNewAvatar("")
                                  }}>
                </TouchableOpacity>
                <View style={styles.modalUpdate}>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            position: "absolute"
                        }}>

                        <TouchableOpacity
                            style={{
                                width: 50, height: 50, left: 10,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={() => {
                                setModalUpdateVisible(!isModalUpdateVisible)
                                setNewUsername('')
                                setNewPassword('')
                                setNewAvatar('')
                            }}
                        >
                            <Text style={{ color: "#0a83f5", fontSize: 20, fontWeight: "bold" }}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: 50, height: 50, right: 12,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={updateUser}
                        >
                            <Text style={{ color: "#0a83f5", fontSize: 20, fontWeight: "bold" }}>Cập nhật</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{ marginVertical: 20 }}>
                        {
                            newAvatar &&
                            <TouchableOpacity onPress={() => setNewAvatar("")}
                                              style={{ position: "absolute", right: 0, backgroundColor: "#f3f4fd", borderRadius: 50 }}>
                                <Image style={{ height: 25, width: 25 }} source={require("../../../assets/img/close.png")} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{
                        width: "85%",
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 20
                    }}>
                        <TextInput
                            style={{
                                backgroundColor: "#f3f4fb",
                                height: 50,
                                width: "100%",
                                fontSize: 20,
                                borderRadius: 10,
                                padding: 10,

                            }}

                            placeholder='Cập nhật tên người dùng'
                            placeholderTextColor="#888"
                            value={newUsername}
                            onChangeText={(value) => {
                                setNewUsername(value)
                            }}
                        />
                        {
                            newUsername &&

                            <MaterialIcons name="cancel" size={25}
                                           onPress={() => setNewUsername("")}
                                           style={{
                                               position: "absolute",
                                               right: 10,
                                           }}
                            />
                        }

                    </View>
                    <View
                        style={{
                            height: 50,
                            width: 50,
                            backgroundColor: "#f3f4fb",
                            borderRadius: 30,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <FontAwesome onPress={pickImageForUpdate} name="picture-o" size={24} color="black" />
                    </View>
                    <Text>Tải lên</Text>
                </View>
            </View>
        </Modal >
    )
}

export default ModalUpdateUser

const styles = StyleSheet.create({
    touchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalUpdateBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',

    },
    modalUpdate: {
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: "white",
        width: '95%',
        height: "40%",
        top: 50

    },
    conversationImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginRight: 10,
    },
})