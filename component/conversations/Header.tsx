import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Header = ({ isModalVisible, setModalVisible }: any) => {
    return (
        <View style={{
            width: "100%", height: "100%", justifyContent: "flex-end", alignItems: "center",
            opacity: 0.99, shadowOpacity: 0.99, backgroundColor: "#FFFFFF"
        }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={"#FFFFFF"} />
            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                Đoạn chat
            </Text>
            <TouchableOpacity
                style={{ width: 30, height: 30, position: "absolute", right: 15, bottom: 10 }}
                onPress={() => setModalVisible(!isModalVisible)}
            >
                <Image style={{ width: 30, height: 30, }}
                    source={require("../../assets/img/edit.png")} />
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})