import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { addTokenToAxios, getAccessToken, setAccessToken } from "../../services/TokenService";
import { loginApi } from "../../services/AuthService";
import Toast from "react-native-toast-message";
import { LinearGradient } from 'expo-linear-gradient';
import Background from "../../component/Background";
import { showToast } from "../../component/showToast";
import { validateEmail } from "../../utils/validate";
import { getUserDataApi } from '../../services/UserService';

const LoginScreen = ({ navigation }: any) => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        checkAuthenticated()
    }, [])

    const getUserData = async () => {
        const res = await getUserDataApi();
        return res.data.user
    }

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

    const checkAuthenticated = async () => {
        try {
            const accessToken = await getAccessToken()
            if (accessToken) {
                addTokenToAxios(accessToken)
                const userData = await getUserData()
                console.log(userData)
                navigation.navigate("HomeTabs", { userData: userData })
            }
        } catch (error) {
            alert(error)
        }
    }

    const onLoginPressed = async () => {
        if (validateEmail(email) && password) {
            try {
                const loginResponse = await loginApi({
                    "email": email,
                    "password": password
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
        <Background>
            <View>
                <View style={styles.header}>
                    <Text numberOfLines={1} style={styles.mainText}>Đăng nhập</Text>

                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.inputItem} >
                        <Ionicons name="mail-outline" size={20} color="#448976" style={styles.inputIcon} />
                        <TextInput
                            // value={email}
                            keyboardType="email-address"
                            placeholder="Nhập địa chỉ Email"
                            style={styles.input}
                            onChangeText={(value) => {
                                setEmail(value)
                            }}
                            onBlur={handleBlurEmail}
                        />
                    </View>
                    {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

                    <View style={styles.inputItem} >
                        <Ionicons name="lock-closed" size={20} color="#448976" style={styles.inputIcon} />
                        <TextInput
                            // value={password}
                            placeholder="Nhập mật khẩu"
                            style={styles.input}
                            secureTextEntry={visible}
                            onChangeText={(value) => {
                                setPassword(value)
                            }}
                            onBlur={handleBlurPassword}
                        />
                        <TouchableOpacity onPress={() => {
                            setVisible(!visible)
                            setShowPassword(!showPassword)
                        }}>
                            <Ionicons name={showPassword === false ? "eye-off-outline" : "eye-outline"} size={25} color="#000" style={{ position: "absolute", right: 5, paddingTop: 5 }} />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
                </View>

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={onLoginPressed}>
                        <LinearGradient
                            colors={['#60711F', '#FA9015']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.logInLabel}>ĐĂNG NHẬP</Text>
                        </LinearGradient>
                    </TouchableOpacity >


                    <View style={styles.another}>
                        <Text style={{ fontSize: 17 }} > Bạn chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("RegisterScreen")
                        }}>
                            <Text style={styles.signUpLabel} >Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            <Toast />
        </Background >

    )
}


export default LoginScreen
const styles = StyleSheet.create({

    header: {
        fontSize: 21,
        marginTop: 150,
        fontWeight: 'bold',
        paddingVertical: 12,
        alignItems: "center"
    },
    mainText: {
        fontSize: 35,
        fontWeight: "bold",
    },
    descriptText: {
        // textAlign: "center",
        fontSize: 20,
        color: "#94979c",
        fontWeight: "bold"
    },
    inputContainer: {
        margin: 20
    },
    inputItem: {
        marginTop: 20,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
    },
    input: {
        width: "100%",
        marginVertical: 5,
        paddingLeft: 30,
        flexDirection: "column"
    },
    inputIcon: {
        marginTop: 10,
        position: "absolute"
    },
    button: {
        marginTop: 20,
        backgroundColor: "",
        width: 250,
        borderRadius: 50,
        padding: 10
    },
    another: {
        marginTop: 10,
        flexDirection: "row",
        fontSize: 17,
        alignItems: "center",
        alignSelf: "flex-end"
    },
    logInLabel: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
        fontSize: 18
    },
    signUpLabel: {
        margin: 10,
        color: "#428DFE",
        fontSize: 17,
        fontWeight: "bold"
    },
    error: {
        color: "red",

    }
})