import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../component/auth/Header'
import Login from '../../component/auth/Login'
import Register from '../../component/auth/Register'
import { addTokenToAxios, getAccessToken } from '../../services/TokenService'
import { initializeSocket, socket } from '../../utils/socket'
import { getUserDataApi } from '../../services/UserService'
import Toast from 'react-native-toast-message'
import { usePushNoti } from '../../utils/usePushNoti';

const DANG_NHAP = "DANG_NHAP"
const DANG_KY = "DANG_KY"

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const AuthScreen = ({ navigation }: any) => {
    const [page, setPage] = useState(DANG_NHAP)
    const [start, setStart] = useState<boolean>(false)

    // Đăng nhập
    useEffect(() => {
        checkAuthenticated()
        setStart(true)
        setTimeout(() => {
            setStart(false)
        }, 2000)
    }, [])
    const getUserData = async () => {
        const res = await getUserDataApi();
        return res.data.user
    }
    const checkAuthenticated = async () => {
        try {
            const accessToken = await getAccessToken()
            if (accessToken) {
                addTokenToAxios(accessToken)
                const userData = await getUserData()
                console.log(userData)
                navigation.navigate("HomeTabs", { userData: userData })
                initializeSocket()
                socket?.emit("addUser", userData._id);
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <View style={styles.container}>

            {start == true ?
                <View style={{
                    backgroundColor: "#FFFFFF", height: "100%", width: "100%",
                    alignItems: "center", justifyContent: "center"
                }}>
                    <Image source={require('../../assets/img/chat-bot.gif')}
                        style={{ height: 100, width: 100 }} />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <View style={{ width: "100%", height: "25%" }}>
                        <Header page={page} setPage={setPage} />
                    </View>
                    {page === DANG_NHAP ?
                        // Đăng nhập
                        <View style={{ flex: 1 }}>
                            <Login checkAuthenticated={checkAuthenticated} />
                        </View> :
                        // Đăng ký
                        <View style={{ flex: 1 }}>
                            <Register page={page} setPage={setPage} />
                        </View>
                    }
                </View>
            }
            <Toast />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight
    }
})

export default AuthScreen
