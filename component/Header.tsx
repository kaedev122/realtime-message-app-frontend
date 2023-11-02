import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constant from 'expo-constants'
//make a Component
export default function Header({ children }: any) {

    return (
        <View style={styles.bgHeader}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    bgHeader: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: 80,
        // Để thêm bóng mờ, sử dụng các thuộc tính shadow
        shadowColor: 'gray', // Màu bóng
        shadowOffset: { width: 0, height: 6 }, // Điểm bắt đầu của bóng
        shadowOpacity: 0.3, // Độ trong suốt của bóng
        elevation: 4, // Elevation cho Android (tùy chọn)
        position: 'relative',
    },

})

