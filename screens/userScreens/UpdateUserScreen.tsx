import React, { useState } from 'react';
import { View, TextInput,  StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { updateUserByIdApi } from '../../services/UserService';

const UpdateUserScreen = ({route}: any) => {
  const { userData } = route.params;
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newPassword, setNewPassword] = useState(userData.password);

  const handleUpdate = async () => {
    try {
      const res = await updateUserByIdApi(userData._id, {
        username: newUsername,
        password: newPassword,
      });
      if (res.status === 200) {
        alert('Thông tin người dùng đã được cập nhật thành công!');
      } else {
        alert('Đã xảy ra lỗi khi cập nhật thông tin người dùng!');
      }
    } catch (error:any) {
      if (error.response.status === 403) {
        alert('Bạn không có quyền cập nhật thông tin người dùng này!');
      } else {
        alert('Đã xảy ra lỗi khi cập nhật thông tin người dùng!');
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.userImage}>
        <TouchableOpacity>
          <Image style={styles.mainImage}                source={ {uri: userData.profilePicture || "https://raw.githubusercontent.com/kaedev122/realtime-message-app-frontend/huybe/assets/img/user.png?fbclid=IwAR3H4i5FTak6CrmPVGwwDtwcvSfMpDK4SGT6ReNvWU2YQrnr1uHoMlKQ5A4"}}
          />
        </TouchableOpacity>
      </View>


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
                    <TouchableOpacity  onPress={handleUpdate}>
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
  userSubmit:{
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
});

export default UpdateUserScreen;