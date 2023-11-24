import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Constant from 'expo-constants'
import COLORS from '../assets/conts/color';
//make a Component
export default function Header({ children }: any) {

    return (
        <SafeAreaView style={{ width: "100%", height: Platform.OS === 'ios' ? "12%" : "9%", backgroundColor: COLORS.main_color }}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    bgHeader: {

    },

})

