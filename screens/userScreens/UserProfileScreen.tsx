import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Modal, TextInput, Dimensions, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { deleteAccessToken, removeTokenFromAxios } from '../../services/TokenService';
import { logoutApi } from '../../services/AuthService';
import { blankAvatar } from '../friendScreen/FriendScreen';
import { socket } from "../../utils/socket";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { getUserDataApi, getUserDataByIdApi, updateUserByIdApi } from "../../services/UserService";
import * as ImagePicker from "expo-image-picker";
import COLORS from '../../assets/conts/color';
import Header from '../../component/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showToast } from '../../component/showToast';
const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const UserProfileScreen = ({ navigation, route }: any) => {
  const { userData } = route.params
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentUserData, setCurrentUserData] = useState(userData);
  const logout = async () => {
    try {
      const accessToken = await deleteAccessToken()
      if (accessToken) {
        const result = await logoutApi();
        console.log(result)
        removeTokenFromAxios()
        navigation.navigate("AuthScreen")
        console.log(accessToken)
        socket.emit('forceDisconnect')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const update = async () => {
    navigation.navigate("UpdateUserScreen")
  }

  const getUserDatabyApi = async () => {
    const res = await getUserDataApi();
    console.log(currentUserData, "123")
    setCurrentUserData(res.data.user)
    return res.data.user
  }

  useFocusEffect(
    useCallback(() => {
      getUserDatabyApi();
    }, [])
  );
  const [newUsername, setNewUsername] = useState(userData?.username);
  const [newEmail, setNewEmail] = useState(userData?.email);
  const [newPassword, setNewPassword] = useState(userData?.password);

  const [newAvatar, setNewAvatar] = useState<string>(userData?.profilePicture);

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
      setIsLoading(true)
      const { data } = await updateUserByIdApi(userData._id, formData)
      console.log(data)
      if (data.success === true) {
        setModalVisible(false)
        console.log("Cập nhật thành công!")
        showToast("success", "Cập nhật thành công!")
      }
      setNewAvatar(newAvatar)
      setNewEmail(newEmail)
      setNewUsername(newUsername)
      setNewPassword(newPassword)

      navigation.goBack()
    } catch (error) {
      console.log(error)
      showToast("error", "Đã xảy ra lỗi !!")

    }
    finally {
      setIsLoading(false);
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
    <View style={{ height: windowHeight - 80, width: windowWidth, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle={"light-content"} backgroundColor={COLORS.main_color} />
      <Header>
        <View style={{ flexDirection: "row", width: "100%", marginTop: Platform.OS === 'ios' ? 10 : 25 }}>
          <Image style={{ width: 80, height: 80, marginTop: 5, marginLeft: 5, borderRadius: 10 }}
            source={userData?.profilePicture ? { uri: currentUserData?.profilePicture } : blankAvatar}
          />
          <View style={{ flexDirection: "column", width: "100%", justifyContent: "space-around", marginLeft: 10 }} >
            <View style={{ backgroundColor: COLORS.main_color, width: "100%" }}>
              <Text style={{ fontSize: 20, color: "#FFFFFF", fontWeight: "bold" }}>{currentUserData?.username}</Text>
            </View>
            <Text style={{ fontSize: 20, color: "gray" }}>{currentUserData?.email}</Text>
          </View>

        </View>
      </Header>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem1} onPress={() => {
          setModalVisible(!isModalVisible)
        }}>
          <FontAwesome name="user" size={28} color="black" />
          <Text style={styles.menuItemText}> Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="md-settings" size={28} color="black" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="md-sunny" size={28} color="black" />
          <Text style={styles.menuItemText}>Appearance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications" size={28} color="black" />
          <Text style={styles.menuItemText}>Notification</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <FontAwesome name="sign-out" size={28} color="black" />
          <Text style={styles.menuItemText}>Log out</Text>
        </TouchableOpacity>

        {/* Thêm các mục quản lý khác ở đây */}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(!isModalVisible)}

      >
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          enableAutomaticScroll={true}
          style={{}}
        >
          <View style={{
            width: windowWidth,
            height: windowHeight,
            backgroundColor: '#f3f4fd',
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

            {/* Image */}
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
                        justifyContent: "center",
                        borderRadius: 10
                      }}
                    />
                  </View>
                ) :
                (<Image style={styles.mainImage}
                  source={userData?.profilePicture ? { uri: userData?.profilePicture } : blankAvatar}
                />)
              }
            </TouchableOpacity>

            <View style={{ width: "100%" }}>

              {/* Email */}
              <Text style={{ marginLeft: 30, marginBottom: 5, fontSize: 20 }}>
                E-mail
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ height: "100%", flex: 1, fontSize: 18, paddingLeft: 10 }}
                  placeholder=" Email"
                  secureTextEntry={false}
                  value={newEmail}
                  onChangeText={(text) => setNewEmail(text)}
                />
              </View>
              {/* Username */}

              <Text style={{ marginLeft: 30, marginBottom: 5, fontSize: 20 }}>
                Username
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ height: "100%", flex: 1, fontSize: 18, paddingLeft: 10 }}
                  placeholder="Username"
                  value={newUsername}
                  onChangeText={(text) => setNewUsername(text)}
                />
              </View>
              {/* Password */}
              <Text style={{ marginLeft: 30, marginBottom: 5, fontSize: 20 }}>
                Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ height: "100%", flex: 1, fontSize: 18, paddingLeft: 10 }}
                  placeholder="Password"
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
              </View>
              <TouchableOpacity style={{
                height: 50, width: windowWidth - 60, borderRadius: 50, backgroundColor: "#FF9134",
                alignItems: "center", justifyContent: 'center', marginLeft: 30, marginTop: 30
              }}
                onPress={handleUpdate}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 18 }}>
                    Cập nhật
                  </Text>
                )}

              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAwareScrollView>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  mainImage: {
    width: 160,
    height: 160,
    marginBottom: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
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
  container: {
    flex: 1,
    height: windowHeight - 80,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF', // Màu nền header
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Màu chữ
  },
  inputContainer: {
    width: windowWidth - 60, height: 50, backgroundColor: "#FFFFFF",
    marginLeft: 30, flexDirection: "row", alignItems: "center", borderRadius: 5, marginBottom: 20
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: "black"
  },
  infor: {
    paddingTop: 14,
    paddingVertical: 9
  },

  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "white"
  },
  email: {
    fontSize: 18,
    color: 'gray',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 50
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 0,
    borderBottomColor: 'lightgray',
    flexDirection: "row"
  },
  menuItem1: {
    paddingVertical: 16,
    borderBottomWidth: 0,
    borderBottomColor: 'lightgray',
    flexDirection: "row",
    padding: 5
  },
  menuItemText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10
  },
});

export default UserProfileScreen