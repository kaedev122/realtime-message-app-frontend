import React, { useId, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, StatusBar, Modal } from 'react-native';
import { getUserDataApi, updateUserByIdApi } from '../../services/UserService';
import { blankAvatar } from '../friendScreen/FriendScreen';
import { updateConversation } from "../../services/ChatService";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from '@expo/vector-icons';


const UpdateUserScreen = ({ navigation, route, isModalVisible, setModalVisible }: any) => {
  const { userData } = route.params;
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [newPassword, setNewPassword] = useState(userData.password);

  const [newAvatar, setNewAvatar] = useState<string>(userData.profilePicture);

  const handleUpdate = async () => {
    const formData = new FormData()
    formData.append("username", newUsername)
    formData.append("password", newPassword)
    formData.append("email", newEmail)

    formData.append("avatar", {
      uri: newAvatar,
      name: "image.jpg",
      type: "image/jpeg",
    })
    try {
      const res = await updateUserByIdApi(userData._id, formData)
      console.log(res)
      setNewAvatar(newAvatar)
      setNewEmail(newEmail)
      setNewUsername(newUsername)
      setNewPassword(newPassword)

      navigation.goBack()
    } catch (error) {
      console.log(error)
    }

  }
  console.log(newAvatar)
  console.log(newUsername)



  const pickAvatarForUpdate = async () => {
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
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(!isModalVisible)}
      >
        <View style={{
          flex: 1,
          backgroundColor: '#f3f4fd', // Màu đen với độ mờ 0.5 (50% mờ)
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }} onPress={() => setModalVisible(!isModalVisible)}>
            {/* Phần xung quanh modal để bắt sự kiện bấm ra ngoài */}
            <MaterialIcons name="cancel" size={30} color={'#FF9134'}
              onPress={() => setModalVisible(!isModalVisible)}
              style={{
                position: "absolute", left: 30, top: 100
              }}
            />
          </TouchableOpacity>


        </View>
      </Modal>
      <TouchableOpacity style={styles.touchable} onPress={() => { navigation.goBack() }}>
        {/* Phần xung quanh modal để bắt sự kiện bấm ra ngoài */}
      </TouchableOpacity>
      <View style={styles.userImage}>
        <TouchableOpacity onPress={() => { pickAvatarForUpdate() }}>

          {newAvatar ?
            (

              <View >

                <Image
                  source={{ uri: newAvatar || newAvatar }}
                  style={{
                    width: 160,
                    height: 160,
                    marginBottom: 70,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </View>
            ) :
            (<Image style={styles.mainImage}
              source={userData?.profilePicture ? { uri: userData?.profilePicture } : blankAvatar}
            />)
          }



        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder=" Email"
        secureTextEntry={false}
        value={newEmail}
        onChangeText={(text) => setNewEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={newUsername}
        onChangeText={(text) => setNewUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder=" Password"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={handleUpdate} style={styles.button}>

          <Text style={styles.logInLabel}>Update</Text>
        </TouchableOpacity >
      </View>
      <StatusBar backgroundColor='black' barStyle="light-content" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: "black"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 20,
    paddingLeft: 8,
    borderRadius: 20,
    backgroundColor: "white"
  },
  mainImage: {
    width: 160,
    height: 160,
    marginBottom: 70,
    alignItems: "center",
    justifyContent: "center"
  },
  userImage: {
    alignItems: "center",
    justifyContent: "center"
  },
  userSubmit: {
    height: 40,
    marginBottom: 16,
    marginHorizontal: 20,
    paddingLeft: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: "",
    width: 250,
    borderRadius: 50,
    padding: 10
  },
  logInLabel: {
    color: "black",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18
  },
  touchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default UpdateUserScreen;