import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import COLORS from '../../assets/conts/color'
const DANG_NHAP = "DANG_NHAP"
const DANG_KY = "DANG_KY"
const Header = ({ page, setPage }: any) => {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={'light-content'} backgroundColor={COLORS.main_color} />
            <View style={{ width: "100%", height: "100%" }}>
                <View style={{
                    width: "100%", flex: 1, backgroundColor: COLORS.main_color,
                    justifyContent: "center", alignItems: "center"
                }}>
                    <Text style={{ fontSize: 50, color: "#FFFFFF", fontWeight: "700" }}>
                        subway.
                    </Text>
                </View>
                <View style={{ height: 50, flexDirection: "row", backgroundColor: "#FFFFFF" }}>
                    <TouchableOpacity
                        onPress={() => setPage(DANG_NHAP)}
                        disabled={page === DANG_NHAP ? true : false}
                        style={{
                            width: "50%", height: "100%",
                            alignItems: "center", justifyContent: "center"
                        }}>
                        <Text style={{
                            fontSize: 17, color: "#FF9134",
                            fontWeight: page === DANG_NHAP ? "600" : "400"
                        }}>Đăng nhập</Text>
                        {page === DANG_NHAP ? <View style={{
                            height: 3, width: "100%", backgroundColor: "#FF9134",
                            position: "absolute", bottom: 0
                        }}></View> : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setPage(DANG_KY)}
                        disabled={page === DANG_KY ? true : false}
                        style={{
                            width: "50%", height: "100%",
                            alignItems: "center", justifyContent: "center"
                        }}>
                        <Text style={{
                            fontSize: 17, color: "#FF9134",
                            fontWeight: page === DANG_KY ? "600" : "400"
                        }}>Đăng ký</Text>
                        {page === DANG_KY ? <View style={{
                            height: 3, width: "100%", backgroundColor: "#FF9134",
                            position: "absolute", bottom: 0
                        }}></View> : null}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({

})