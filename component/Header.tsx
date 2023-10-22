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
        elevation: 10,
        height: 80,
        shadowColor: '#00000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        position: 'relative',
    },
})

