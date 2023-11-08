import { StyleSheet, View, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'

const ModalImageShow = ({ image, imageSize, windowWidth }) => {
    const [isModalImageVisible, setModalImageVisible] = useState(false);
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
                </TouchableOpacity>
                <Image
                    source={{ uri: image }}
                    style={{
                        width: imageSize.width * 0.3,
                        height: imageSize.height * 0.3,
                        maxWidth: windowWidth * 0.9
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