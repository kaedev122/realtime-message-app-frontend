import React, {useId, useState} from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {getUserDataApi, updateUserByIdApi} from '../../services/UserService';
import { blankAvatar } from '../friendScreen/FriendScreen';
import {updateConversation} from "../../services/ChatService";
import * as ImagePicker from "expo-image-picker";


const UpdateUserScreen = ({ navigation, route }: any) => {
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
      <TouchableOpacity style={styles.touchable} onPress={() => { navigation.goBack() }}>
        {/* Phần xung quanh modal để bắt sự kiện bấm ra ngoài */}
      </TouchableOpacity>
      <View style={styles.userImage}>
        <TouchableOpacity  onPress={() => {pickAvatarForUpdate()}}>

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
              ):
              ( <Image style={styles.mainImage}
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
        <TouchableOpacity onPress={handleUpdate }  >
          <LinearGradient
            colors={['#438875', '#99F2C8']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.logInLabel}>Update</Text>
          </LinearGradient>
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