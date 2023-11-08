import { Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons'
import { showToast } from '../showToast'
import { validateEmail } from '../../utils/validate'
import { registerApi } from '../../services/AuthService'
import Toast from 'react-native-toast-message'
const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const Register = ({ setPage }: any) => {
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
                showToast("success", "Đăng ký thành công", "Đăng nhập để tiếp tục!")
                if (data.success = true) {
                    setTimeout(() => {
                        setPage("DANG_NHAP")
                    }, 3000)
                }
            } catch (err) {
                showToast("error", "Email đã tồn tại!")
            }
        } else {
            showToast("error", "Vui lòng nhập đủ thông tin‼‼")
        }
    };

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", height: "100%" }}>

            <View style={{ flex: 1, height: windowHeight * 0.6, justifyContent: "center" }}>
                <Text style={{ fontSize: 24, marginLeft: 30 }}>Nhập thông tin để đăng ký.</Text>

                {/* Name */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={25} color="gray" style={{ marginHorizontal: 10 }} />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor='#888'
                        autoCapitalize={'none'}
                        placeholder="Nhập tên"
                        onChangeText={(value) => {
                            setUsername(value)
                        }}
                        onBlur={handleBlurUsername} />
                </View>
                {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

                {/* E-mail */}
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={25} color="gray" style={{ marginHorizontal: 10 }} />
                    <TextInput
                        style={styles.input}
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
                        style={styles.input}
                        placeholder='Mật khẩu'
                        onChangeText={(value) => {
                            setPassword(value)
                        }}
                        placeholderTextColor='#888'
                        secureTextEntry={visible}
                        onBlur={handleBlurPassword}
                        autoCapitalize={'none'} />
                    <TouchableOpacity
                        style={styles.seePassword}
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

                {/* Re-Password */}
                <View style={styles.inputContainer}>
                    <Ionicons name="ios-lock-closed-outline" size={25} color="gray" style={{ marginHorizontal: 10 }} />
                    <TextInput
                        style={styles.input}
                        placeholder='Nhập lại mật khẩu'
                        placeholderTextColor='#888'
                        value={confirmedPassword}
                        secureTextEntry={visible1}
                        onChangeText={(value) => {
                            setConfirmedPassword(value)
                        }}
                        onBlur={handleBlurConfirmedPassword}
                        autoCapitalize={'none'} />
                    <TouchableOpacity
                        style={styles.seePassword}
                        onPress={() => {
                            setVisible1(!visible1)
                            setShowConfirmPassword(!showConfirmPassword)
                        }}>
                        <Ionicons name={showPassword === false ? "eye-off-outline" : "eye-outline"}
                            size={25} color="#888"
                        />
                    </TouchableOpacity>
                </View>
                {confirmedPasswordError ? <Text style={styles.error}>{confirmedPasswordError}</Text> : null}

                {/* button */}
                <TouchableOpacity style={{
                    height: 50, width: windowWidth - 60, borderRadius: 50, backgroundColor: "#FF9134",
                    alignItems: "center", justifyContent: 'center', marginLeft: 30, marginTop: 30
                }}
                    onPress={onSignUpPressed}
                >
                    <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 18 }}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
            <Toast />
        </KeyboardAwareScrollView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    error: {
        color: "red",
        textAlign: "right",
        marginRight: 30,
        marginTop: 5,
    },
    inputContainer: {
        width: windowWidth - 60, height: 50, backgroundColor: "#FFFFFF",
        marginTop: 20, marginLeft: 30, flexDirection: "row", alignItems: "center", borderRadius: 5
    },
    input: {
        height: "100%",
        flex: 1,
        fontSize: 18,
        paddingLeft: 10
    },
    seePassword: {
        height: "100%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})