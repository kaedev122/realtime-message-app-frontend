import React, { useState } from "react"
import { Image, View, StyleSheet, Text, TextInput, TouchableOpacity, Platform } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { registerApi } from '../../services/AuthService'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import Background from "../../component/Background";
import { LinearGradient } from "expo-linear-gradient"
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { showToast } from "../../component/showToast";
import { validateEmail } from "../../utils/validate";


const RegisterScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmedPasswordError, setConfirmedPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [visible, setVisible] = useState(true)
    const [visible1, setVisible1] = useState(true)

    const handleBlurUsername = () => {
        if (!username) {
            setUsernameError("Vui lòng nhập tên người dùng.");
        } else {
            setUsernameError("");
        }
    };
    const handleBlurEmail = () => {
        if (!email) {
            setEmailError("Vui lòng nhập địa chỉ email.");
        } else if (!validateEmail(email)) {
            setEmailError("Địa chỉ email không hợp lệ.");
        } else {
            setEmailError("");
        }
    };
    const handleBlurPassword = () => {
        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu.");
        } else {
            setPasswordError("");
        }
    };
    const handleBlurConfirmedPassword = () => {
        if (!confirmedPassword) {
            setConfirmedPasswordError("Vui lòng xác nhận mật khẩu.");
        } else if (password !== confirmedPassword) {
            setConfirmedPasswordError("Mật khẩu xác nhận không khớp.");
        } else {
            setConfirmedPasswordError("");
        }
    };
    const onSignUpPressed = async () => {
        if (username && validateEmail(email) && password && password === confirmedPassword) {
            try {
                const signupResponse = await registerApi({
                    username: username,
                    email: email,
                    password: password
                })
                const { data } = signupResponse
                console.log(data)
                showToast("success", "Đăng ký thành công!")

                setTimeout(() => {
                    navigation.replace("LoginScreen")
                }, 3000)
            } catch (err) {
                const { data } = err.response
                showToast("error", "Email đã tồn tại!")

            }
        } else {
            showToast("error", "Vui lòng nhập đủ thông tin!")
        }
    };
    return (
        <Background>
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }} style={styles.container}>
                <Image
                    style={styles.image}
                    source={require('../../assets/img/arrow_back.png')}
                />
            </TouchableOpacity>

            <View>
                <View style={styles.header}>
                    <Text numberOfLines={1} style={styles.mainText}>Đăng ký</Text>
                </View>
                <View style={styles.inputContainer}>

                    <View style={styles.inputItem} >
                        <Ionicons name="person-outline" size={20} color="#448976" style={styles.inputIcon} />
                        <TextInput value={username}
                            placeholder="Nhập tên"
                            style={styles.input}
                            onChangeText={(value) => {
                                setUsername(value)
                            }}
                            onBlur={handleBlurUsername}
                        />
                    </View>
                    {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

                    <View style={styles.inputItem} >
                        <Ionicons name="mail-outline" size={20} color="#448976" style={styles.inputIcon} />
                        <TextInput value={email}
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
                        <TextInput value={password}
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


                    <View style={styles.inputItem} >
                        <Ionicons name="lock-closed" size={20} color="#448976" style={styles.inputIcon} />
                        <TextInput
                            value={confirmedPassword}
                            placeholder="Nhập lại mật khẩu"
                            style={styles.input}
                            secureTextEntry={visible1}
                            onChangeText={(value) => {
                                setConfirmedPassword(value)
                            }}
                            onBlur={handleBlurConfirmedPassword}
                        />
                        <TouchableOpacity onPress={() => {
                            setVisible1(!visible1)
                            setShowConfirmPassword(!showConfirmPassword)
                        }}>
                            <Ionicons name={showConfirmPassword === false ? "eye-off-outline" : "eye-outline"} size={25} color="#000" style={{ position: "absolute", right: 5, paddingTop: 5 }} />
                        </TouchableOpacity>
                    </View>
                    {confirmedPasswordError ? <Text style={styles.error}>{confirmedPasswordError}</Text> : null}

                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={onSignUpPressed}>
                        <LinearGradient
                            colors={['#60711F', '#FA9015']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.signUpLabel}>ĐĂNG KÝ</Text>
                        </LinearGradient>
                    </TouchableOpacity >
                    <View style={styles.another}>
                        <Text style={{ fontSize: 17 }}> Đã có tài khoản?</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack()
                        }}>
                            <Text style={styles.loginLabel} >Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Toast />
        </Background>
    )
}



const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: getStatusBarHeight(),
        left: 4,
    },
    image: {
        width: 24,
        height: 24,
    },
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
    signUpLabel: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
        fontSize: 18
    },
    loginLabel: {
        margin: 10,
        color: "#428DFE",
        fontSize: 17,
        fontWeight: "bold"
    },
    error: {
        color: "red",

    }

})
export default RegisterScreen