import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { EvilIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../assets/conts/color';

const Header = ({ isModalVisible, setModalVisible, textSearch, setTextSearch }: any) => {
    return (
        <SafeAreaView style={{
            width: "100%", height: "100%", alignItems: "flex-end",
            backgroundColor: COLORS.main_color, flexDirection: "row",
        }}>
            {/* <StatusBar barStyle={'light-content'} backgroundColor={COLORS.main_color} /> */}
            <View style={{
                paddingLeft: 10, flex: 1, height: 40, gap: 10, flexDirection: "row", justifyContent: "center", alignItems: "center"
            }}>
                <EvilIcons name="search" size={26} color="#FFFFFF" />
                <TextInput
                    value={textSearch}
                    placeholder="Tìm kiếm"
                    placeholderTextColor={"#FFFFFF"}
                    style={{ flex: 1, height: "100%", fontSize: 18, color: "#FFFFFF" }}
                    onChangeText={(value) => {
                        setTextSearch(value);
                    }}
                />
                {textSearch && (
                    <MaterialIcons name="cancel" size={25} color={"gray"}
                        onPress={() => setTextSearch("")}
                        style={{ position: "absolute", right: 10 }}
                    />
                )}
            </View>
            <TouchableOpacity
                style={{ width: 50, height: 40, alignItems: "center", justifyContent: "center" }}
                onPress={() => setModalVisible(!isModalVisible)}
            >
                <Feather name="edit" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({})