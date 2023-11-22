// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, StatusBar } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { updateUserByIdApi } from '../../services/UserService';
// import { blankAvatar } from '../friendScreen/FriendScreen';
// import * as ImagePicker from "expo-image-picker";
// import {updateConversation} from "../../services/ChatService";
// import {Avatar} from "react-native-gifted-chat";
//
// const UpdateUserScreen = ({ navigation, route }: any) => {
//   const { userData } = route.params;
//   const [newUsername, setNewUsername] = useState(userData.username);
//   const [newPassword, setNewPassword] = useState(userData.password);
//
//   const [avatar, setAvatar] = useState<string>('');
//   const [newAvatar, setNewAvatar] = useState<string>(avatar);
//
//   const handleUpdate = async () => {
//     try {
//       const res = await updateUserByIdApi(userData._id, {
//         username: newUsername,
//         password: newPassword,
//       });
//       if (res.status === 200) {
//         alert('Thông tin người dùng đã được cập nhật thành công!');
//       } else {
//         alert('Đã xảy ra lỗi khi cập nhật thông tin người dùng!');
//       }
//     } catch (error: any) {
//       if (error.response.status === 403) {
//         alert('Bạn không có quyền cập nhật thông tin người dùng này!');
//       } else {
//         alert('Đã xảy ra lỗi khi cập nhật thông tin người dùng!');
//       }
//     }
//   };
//
//   const pickAvatar = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setAvatar(result.assets[0].uri)
//
//     }
//   }
//
//   const updateAvatar = async () => {
//     const formData = new FormData()
//     formData.append("newAvatar", {
//       uri: setNewAvatar,
//       name: "image.jpg",
//       type: "image/jpeg",
//     })
//     try {
//       const res = await updateAvatar(userData._id, formData)
//       console.log(res)
//       setNewAvatar(newAvatar)
//     } catch (error) {
//
//     }
//   }
//
//
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.touchable} onPress={() => { navigation.goBack() }}>
//       </TouchableOpacity>
//       <View style={styles.userImage}>
//         <TouchableOpacity onPress={pickAvatar}>
//           <Image style={styles.mainImage}
//             source={userData?.profilePicture ? { uri: userData?.profilePicture } : blankAvatar}
//           />
//         </TouchableOpacity>
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         value={newUsername}
//         onChangeText={(text) => setNewUsername(text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder=" Password"
//         secureTextEntry={true}
//         value={newPassword}
//         onChangeText={(text) => setNewPassword(text)}
//       />
//       <View style={{ justifyContent: "center", alignItems: "center" }}>
//         <TouchableOpacity onPress={handleUpdate}>
//           <LinearGradient
//             colors={['#438875', '#99F2C8']}
//             start={{ x: 0, y: 1 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.button}
//           >
//             <Text style={styles.logInLabel}>Update</Text>
//           </LinearGradient>
//         </TouchableOpacity >
//       </View>
//       <StatusBar backgroundColor='black' barStyle="light-content" />
//
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: "black"
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 16,
//     marginHorizontal: 20,
//     paddingLeft: 8,
//     borderRadius: 20,
//     backgroundColor: "white"
//   },
//   mainImage: {
//     width: 160,
//     height: 160,
//     marginBottom: 70,
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   userImage: {
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   userSubmit: {
//     height: 40,
//     marginBottom: 16,
//     marginHorizontal: 20,
//     paddingLeft: 8,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "",
//     width: 250,
//     borderRadius: 50,
//     padding: 10
//   },
//   logInLabel: {
//     color: "black",
//     fontWeight: "700",
//     textAlign: "center",
//     fontSize: 18
//   },
//   touchable: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });
//
//
//
//
// export default UpdateUserScreen;