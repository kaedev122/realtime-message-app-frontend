import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const UserModal = ({ user, visible, onRequestClose, onAddFriend, onStartChat }) => {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Thông tin người dùng</Text>
                    <Text style={styles.username}>{user.username}</Text>
                    <TouchableOpacity onPress={onAddFriend}>
                        <Text style={styles.actionButton}>Kết bạn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onStartChat}>
                        <Text style={styles.actionButton}>Bắt đầu cuộc trò chuyện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRequestClose}>
                        <Text style={styles.closeButton}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    username: {
        fontSize: 16,
        marginBottom: 10,
    },
    actionButton: {
        fontSize: 16,
        color: "blue",
        marginBottom: 10,
    },
    closeButton: {
        fontSize: 16,
        color: "red",
    },
});

export default UserModal;
