import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Media = () => {
    const [image, setImage] = useState(null);

    const selectImageFromCamera = () => {
        launchCamera({ mediaType: 'photo' }, response => {
            if (!response.didCancel) {
                // Nếu người dùng không hủy bỏ việc chụp ảnh
                setImage({ uri: response.uri });
            }
        });
    };

    const selectImageFromLibrary = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (!response.didCancel) {
                // Nếu người dùng không hủy bỏ việc chọn ảnh từ thư viện
                setImage({ uri: response.uri });
            }
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {image && <Image source={image} style={{ width: 200, height: 200 }} />}
            <Button title="Chụp ảnh" onPress={selectImageFromCamera} />
            <Button title="Chọn từ thư viện" onPress={selectImageFromLibrary} />
        </View>
    );
};;

export default Media;
