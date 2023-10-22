import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NewChat = () => {
    return (
        <View style={styles.container}>
            <Text>NewChat</Text>
        </View>
    )
}

export default NewChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})