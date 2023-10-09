import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function Background({ children }) {
    return (
        <LinearGradient

            colors={['#ded145', '#fff']}
            start={{ x: 0.2, y: 0.1 }}
            end={{ x: 1, y: 0.9 }}
            style={styles.background}
        >

            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                style={styles.container}>
                {children}

            </KeyboardAwareScrollView>
        </LinearGradient>


    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        // backgroundColor: "white"
    },
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        alignSelf: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
})