import { View, Text } from 'react-native'
import React from 'react'
import Toast from 'react-native-toast-message'

export const showToast = (type, text1, text2) => {
    Toast.show({
        type,
        text1,
        text2,
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
        topOffset: 70,
    });
};