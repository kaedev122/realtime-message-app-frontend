import axios from "axios"
import * as SecureStore from 'expo-secure-store'

export const setAccessToken = async (accessToken: string) => {
    if (!accessToken) {
        return false
    }
    try {
        await SecureStore.setItemAsync('accessToken', accessToken)
        return true
    } catch (error) {
        console.log("Lỗi khi lưu token", error)
    }
    return false
}

export const getAccessToken = async () => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken')
        return accessToken
    } catch (error) {
        console.log("Lỗi khi lưu token", error)
    }
    return false
}

export const addTokenToAxios = (accessToken: string) => {
    axios.defaults.headers.common = {
        'authorization': `Bearer ${accessToken}`
    };
}

export const deleteAccessToken = async () => {
    try {
        await SecureStore.deleteItemAsync('accessToken');
        return true;
    } catch (error) {
        console.log("Lỗi khi xóa token", error);
    }
    return false;
}

export const removeTokenFromAxios = () => {
    try{
        delete axios.defaults.headers.common["authorization"];
        console.log(getAccessToken())
        return true;
    } catch (error) {
        console.log("Lỗi khi xóa token khỏi axios", error);
    }
    return false;
}