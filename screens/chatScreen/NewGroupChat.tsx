import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const NewGroupChat = () => {
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={styles.touchable} onPress={toggleModal}>
                        {/* Phần xung quanh modal để bắt sự kiện bấm ra ngoài */}
                    </TouchableOpacity>
                    <View style={styles.modalImage}>
                        <Image style={{ height: 350, width: 350 }} source={{ uri: `${selectedMessage.image}` }} />
                    </View>
                </View>
            </Modal>
            <StatusBar style="dark" backgroundColor='white' />
        </View>
    )
}

export default NewGroupChat

const styles = StyleSheet.create({
    container: {

    },
})