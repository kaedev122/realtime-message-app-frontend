import { Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { validateEmail } from "../../utils/validate";
import { setAccessToken } from '../../services/TokenService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showToast } from '../showToast';
import { loginApi } from '../../services/AuthService';
import Toast from 'react-native-toast-message';
import { usePushNoti } from '../../utils/usePushNoti';

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const Login = ({ checkAuthenticated }: any) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [visible, setVisible] = useState(true)
    const { expoPushToken } = usePushNoti()
    
    const handleBlurEmail = () => {
        if (!email) {
            setEmailError("Vui lòng nhập địa chỉ email.")
        } else if (!validateEmail(email)) {
            setEmailError("Địa chỉ email không hợp lệ.")
        } else {
            setEmailError("");
        }
    };

    const handleBlurPassword = () => {
        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu.")
        } else {
            setPasswordError("");
        }
    }

    const onLoginPressed = async () => {
        if (validateEmail(email) && password) {
            try {
                const loginResponse = await loginApi({
                    "email": email,
                    "password": password,
                    "device_token": expoPushToken.data
                })

                const { data } = loginResponse
                console.log(data.success)
                if (data.success === false) {
                    showToast("error", "Thông tin không đúng!")
                }
                const result = await setAccessToken(data?.token)
                console.log("AccessToken", result)
                checkAuthenticated();
            } catch (error) {
                alert(error)
            }
        } else {
            showToast("error", "Vui lòng nhập đủ thông tin!")
        }
    }
    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
            enableAutomaticScroll={true}

            style={{ flex: 1 }}>

            <View style={{ flex: 1, height: 0.4 * windowHeight, justifyContent: "center" }}>
                <Text style={{ fontSize: 24, marginLeft: 30 }}>Nhập tài khoản của bạn.</Text>
                {/* E-mail */}
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={25} color="gray" style={{ marginHorizontal: 10 }} />
                    <TextInput
                        style={{ height: "100%", flex: 1, fontSize: 18, paddingLeft: 10 }}
                        placeholder='E-mail'
                        keyboardType="email-address"
                        placeholderTextColor='#888'
                        autoCapitalize={'none'}
                        onChangeText={(value) => {
                            setEmail(value)
                        }}
                        onBlur={handleBlurEmail} />
                </View>
                {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

                {/* Password */}
                <View style={styles.inputContainer}>
                    <Ionicons name="ios-lock-closed-outline" size={25} color="gray" style={{ marginHorizontal: 10 }} />
                    <TextInput
                        style={{ height: "100%", flex: 1, fontSize: 18, paddingLeft: 10 }}
                        placeholder='Mật khẩu'
                        onChangeText={(value) => {
                            setPassword(value)
                        }}
                        placeholderTextColor='#888'
                        secureTextEntry={visible}
                        onBlur={handleBlurPassword}
                        autoCapitalize={'none'} />
                    <TouchableOpacity
                        style={{ height: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}
                        onPress={() => {
                            setVisible(!visible)
                            setShowPassword(!showPassword)
                        }}>
                        <Ionicons name={showPassword === false ? "eye-off-outline" : "eye-outline"}
                            size={25} color="#888"
                        />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
                <TouchableOpacity style={{
                    height: 50, width: windowWidth - 60, borderRadius: 50, backgroundColor: "#FF9134",
                    alignItems: "center", justifyContent: 'center', marginLeft: 30, marginTop: 30
                }}
                    onPress={onLoginPressed}
                >
                    <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 18 }}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
            <Toast />
        </KeyboardAwareScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    error: {
        color: "red",
        textAlign: "right",
        marginRight: 30,
        marginTop: 10,
    },
    inputContainer: {
        width: windowWidth - 60, height: 50, backgroundColor: "#FFFFFF",
        marginTop: 20, marginLeft: 30, flexDirection: "row", alignItems: "center", borderRadius: 5
    }
})