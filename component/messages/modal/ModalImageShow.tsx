import { StyleSheet, View, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';

const ModalImageShow = ({ image, isModalImageVisible, setModalImageVisible }: any) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={isModalImageVisible}
            onRequestClose={() => setModalImageVisible(!isModalImageVisible)}
        >
            <View style={styles.modalImageBackground}>
                <TouchableOpacity style={styles.touchable} onPress={() => setModalImageVisible(!isModalImageVisible)}>
                    {/* Phần xung quanh modal để bắt sự kiện bấm ra ngoài */}
                    <MaterialIcons name="cancel" size={30} color={'#FF9134'}
                        onPress={() => setModalImageVisible(!isModalImageVisible)}
                        style={{
                            position: "absolute", left: 30, top: 100
                        }}
                    />
                </TouchableOpacity>
                <Image
                    source={{ uri: `${image}` }}
                    style={{
                        width: 400,
                        height: 400
                    }}
                />
            </View>
        </Modal>
    )
}

export default ModalImageShow

const styles = StyleSheet.create({
    modalImageBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Màu đen với độ mờ 0.5 (50% mờ)
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        borderRadius: 10,
        alignItems: 'center',
    },
    touchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})